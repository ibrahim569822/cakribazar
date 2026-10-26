<?php

include '../connection.php';
require_once '../require-authenticated-user.php';

function application_details_response($status, $body)
{
    http_response_code($status);
    echo json_encode($body);
    exit;
}

function application_details_rows($connection, $query, $userId, $applicationId = null)
{
    $statement = $connection->prepare($query);
    if (!$statement) {
        error_log('Unable to prepare applicant details query: ' . $connection->error);
        application_details_response(500, ['status' => false, 'message' => 'Unable to load applicant details']);
    }

    if ($applicationId === null) {
        $statement->bind_param('i', $userId);
    } else {
        $statement->bind_param('ii', $applicationId, $userId);
    }

    try {
        $statement->execute();
    } catch (mysqli_sql_exception $error) {
        error_log('Unable to execute applicant details query: ' . $error->getMessage());
        $statement->close();
        application_details_response(500, ['status' => false, 'message' => 'Unable to load applicant details']);
    }

    $rows = $statement->get_result()->fetch_all(MYSQLI_ASSOC);
    $statement->close();
    return $rows;
}

$user = require_authenticated_user($cc->conn);
if (!in_array((int) $user['role'], [2, 3], true)) {
    application_details_response(403, ['status' => false, 'message' => 'Only employers can view applicant details']);
}

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    header('Allow: GET, OPTIONS');
    application_details_response(405, ['status' => false, 'message' => 'Method not allowed']);
}

$applicationId = filter_input(INPUT_GET, 'id', FILTER_VALIDATE_INT);
if (!$applicationId || $applicationId < 1) {
    application_details_response(400, ['status' => false, 'message' => 'A valid application ID is required']);
}

$applicationQuery = 'SELECT a.id, a.job_id, a.seeker_id, a.cover_letter, a.resume, a.status, a.applied_at,
        j.title AS job_title, c.user_id AS company_user_id
    FROM applications a
    INNER JOIN jobs j ON j.id = a.job_id
    INNER JOIN companies c ON c.id = j.company_id
    WHERE a.id = ? AND a.deleted_at IS NULL';
if ((int) $user['role'] === 2) {
    $applicationQuery .= ' AND c.user_id = ?';
}

$applicationStatement = $cc->conn->prepare($applicationQuery);
if (!$applicationStatement) {
    error_log('Unable to prepare application details lookup: ' . $cc->conn->error);
    application_details_response(500, ['status' => false, 'message' => 'Unable to load applicant details']);
}
if ((int) $user['role'] === 2) {
    $applicationStatement->bind_param('ii', $applicationId, $user['id']);
} else {
    $applicationStatement->bind_param('i', $applicationId);
}
try {
    $applicationStatement->execute();
} catch (mysqli_sql_exception $error) {
    error_log('Unable to execute application details lookup: ' . $error->getMessage());
    $applicationStatement->close();
    application_details_response(500, ['status' => false, 'message' => 'Unable to load applicant details']);
}
$application = $applicationStatement->get_result()->fetch_assoc();
$applicationStatement->close();

if (!$application) {
    application_details_response(404, ['status' => false, 'message' => 'Application not found']);
}

$seekerId = (int) $application['seeker_id'];
$seeker = application_details_rows(
    $cc->conn,
    'SELECT id, name, email, username, contact FROM users WHERE id = ? AND deleted_at IS NULL LIMIT 1',
    $seekerId
);
$profile = application_details_rows(
    $cc->conn,
    'SELECT job_title, summary, gender, date_of_birth, country, address, image, twitter, linkedin FROM seeker_profiles WHERE user_id = ? AND deleted_at IS NULL LIMIT 1',
    $seekerId
);
$education = application_details_rows(
    $cc->conn,
    'SELECT id, degree, institution, field, passing_year, result FROM education WHERE seeker_id = ? AND deleted_at IS NULL ORDER BY passing_year DESC, id DESC',
    $seekerId
);
$experience = application_details_rows(
    $cc->conn,
    'SELECT id, company_name, position, start_date, end_date, is_current, description FROM experience WHERE seeker_id = ? AND deleted_at IS NULL ORDER BY start_date DESC, id DESC',
    $seekerId
);
$skills = application_details_rows(
    $cc->conn,
    'SELECT s.id, s.name FROM seeker_skills ss INNER JOIN skills s ON s.id = ss.skill_id WHERE ss.seeker_id = ? AND ss.deleted_at IS NULL AND s.deleted_at IS NULL ORDER BY s.name',
    $seekerId
);

application_details_response(200, [
    'status' => true,
    'data' => [
        'application' => $application,
        'seeker' => $seeker[0] ?? null,
        'profile' => $profile[0] ?? null,
        'education' => $education,
        'experience' => $experience,
        'skills' => $skills,
    ],
]);
