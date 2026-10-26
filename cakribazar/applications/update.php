<?php
include '../connection.php';
require_once '../require-authenticated-user.php';

$user = require_authenticated_user($cc->conn);
$id = filter_input(INPUT_GET, 'id', FILTER_VALIDATE_INT);
$status = filter_var($_POST['status'] ?? null, FILTER_VALIDATE_INT);

if (!$id || !$status || $status < 1 || $status > 6) {
    http_response_code(400);
    echo json_encode(['status' => false, 'message' => 'A valid application ID and status are required']);
    exit;
}

if (!in_array((int) $user['role'], [2, 3], true)) {
    http_response_code(403);
    echo json_encode(['status' => false, 'message' => 'Only employers can update application status']);
    exit;
}

$applicationQuery = 'SELECT applications.id
    FROM applications
    JOIN jobs ON jobs.id = applications.job_id
    JOIN companies ON companies.id = jobs.company_id
    WHERE applications.id = ? AND applications.deleted_at IS NULL';
if ((int) $user['role'] === 2) {
    $applicationQuery .= ' AND companies.user_id = ?';
}

$applicationStatement = $cc->conn->prepare($applicationQuery);
if (!$applicationStatement) {
    http_response_code(500);
    echo json_encode(['status' => false, 'message' => 'Unable to verify application']);
    exit;
}

if ((int) $user['role'] === 2) {
    $applicationStatement->bind_param('ii', $id, $user['id']);
} else {
    $applicationStatement->bind_param('i', $id);
}
if (!$applicationStatement->execute()) {
    $applicationStatement->close();
    http_response_code(500);
    echo json_encode(['status' => false, 'message' => 'Unable to verify application']);
    exit;
}
$applicationExists = $applicationStatement->get_result()->fetch_assoc();
$applicationStatement->close();

if (!$applicationExists) {
    http_response_code(404);
    echo json_encode(['status' => false, 'message' => 'Application not found']);
    exit;
}

$updateStatement = $cc->conn->prepare('UPDATE applications SET status = ? WHERE id = ?');
if (!$updateStatement) {
    http_response_code(500);
    echo json_encode(['status' => false, 'message' => 'Unable to update application status']);
    exit;
}

$updateStatement->bind_param('ii', $status, $id);
if (!$updateStatement->execute()) {
    http_response_code(500);
    echo json_encode(['status' => false, 'message' => 'Unable to update application status']);
    $updateStatement->close();
    exit;
}

$updateStatement->close();
echo json_encode(['status' => true, 'message' => 'Application status updated']);
