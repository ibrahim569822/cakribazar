<?php

include '../connection.php';
require_once '../require-authenticated-user.php';

function history_response($status, $body)
{
    http_response_code($status);
    echo json_encode($body);
    exit;
}

function valid_history_date($value)
{
    $date = DateTime::createFromFormat('!Y-m-d', $value);
    return $date && $date->format('Y-m-d') === $value;
}

$user = require_authenticated_user($cc->conn);
if ((int) $user['role'] !== 1) {
    history_response(403, ['status' => false, 'message' => 'Only seekers can manage education and experience']);
}

$type = $_GET['type'] ?? '';
$tables = [
    'education' => [
        'table' => 'education',
        'order' => 'passing_year DESC, id DESC',
        'columns' => 'id, degree, institution, field, passing_year, result',
    ],
    'experience' => [
        'table' => 'experience',
        'order' => 'start_date DESC, id DESC',
        'columns' => 'id, company_name, position, start_date, end_date, is_current, description',
    ],
];
if (!isset($tables[$type])) {
    history_response(400, ['status' => false, 'message' => 'Choose a valid history type']);
}

$table = $tables[$type]['table'];
$method = $_SERVER['REQUEST_METHOD'];
$seekerId = (int) $user['id'];

if ($method === 'GET') {
    $statement = $cc->conn->prepare(
        "SELECT {$tables[$type]['columns']} FROM $table WHERE seeker_id = ? AND deleted_at IS NULL ORDER BY {$tables[$type]['order']}"
    );
    if (!$statement) {
        error_log("Unable to prepare $type list query: " . $cc->conn->error);
        history_response(500, ['status' => false, 'message' => "Unable to load $type"]);
    }
    $statement->bind_param('i', $seekerId);
    if (!$statement->execute()) {
        error_log("Unable to execute $type list query: " . $statement->error);
        $statement->close();
        history_response(500, ['status' => false, 'message' => "Unable to load $type"]);
    }
    $records = $statement->get_result()->fetch_all(MYSQLI_ASSOC);
    $statement->close();
    history_response(200, ['status' => true, 'data' => $records]);
}

if ($method === 'DELETE') {
    $id = filter_input(INPUT_GET, 'id', FILTER_VALIDATE_INT);
    if (!$id || $id < 1) {
        history_response(400, ['status' => false, 'message' => 'A valid record ID is required']);
    }

    $statement = $cc->conn->prepare(
        "UPDATE $table SET deleted_at = CURRENT_TIMESTAMP WHERE id = ? AND seeker_id = ? AND deleted_at IS NULL"
    );
    if (!$statement) {
        error_log("Unable to prepare $type delete query: " . $cc->conn->error);
        history_response(500, ['status' => false, 'message' => "Unable to delete $type"]);
    }
    $statement->bind_param('ii', $id, $seekerId);
    if (!$statement->execute()) {
        error_log("Unable to execute $type delete query: " . $statement->error);
        $statement->close();
        history_response(500, ['status' => false, 'message' => "Unable to delete $type"]);
    }
    $deleted = $statement->affected_rows > 0;
    $statement->close();
    if (!$deleted) {
        history_response(404, ['status' => false, 'message' => 'Record not found']);
    }
    history_response(200, ['status' => true, 'message' => 'Record deleted']);
}

if ($method !== 'POST') {
    header('Allow: GET, POST, DELETE, OPTIONS');
    history_response(405, ['status' => false, 'message' => 'Method not allowed']);
}

$id = null;
if (isset($_GET['id'])) {
    $id = filter_var($_GET['id'], FILTER_VALIDATE_INT);
    if (!$id || $id < 1) {
        history_response(400, ['status' => false, 'message' => 'A valid record ID is required']);
    }

    $ownerStatement = $cc->conn->prepare(
        "SELECT id FROM $table WHERE id = ? AND seeker_id = ? AND deleted_at IS NULL LIMIT 1"
    );
    if (!$ownerStatement) {
        error_log("Unable to prepare $type ownership query: " . $cc->conn->error);
        history_response(500, ['status' => false, 'message' => "Unable to update $type"]);
    }
    $ownerStatement->bind_param('ii', $id, $seekerId);
    if (!$ownerStatement->execute()) {
        error_log("Unable to execute $type ownership query: " . $ownerStatement->error);
        $ownerStatement->close();
        history_response(500, ['status' => false, 'message' => "Unable to update $type"]);
    }
    $ownedRecord = $ownerStatement->get_result()->fetch_assoc();
    $ownerStatement->close();
    if (!$ownedRecord) {
        history_response(404, ['status' => false, 'message' => 'Record not found']);
    }
}

if ($type === 'education') {
    $degree = trim($_POST['degree'] ?? '');
    $institution = trim($_POST['institution'] ?? '');
    $field = trim($_POST['field'] ?? '');
    $passingYearValue = trim($_POST['passing_year'] ?? '');
    $result = trim($_POST['result'] ?? '');

    if ($degree === '' || $institution === '') {
        history_response(400, ['status' => false, 'message' => 'Degree and institution are required']);
    }
    if (strlen($degree) > 100 || strlen($institution) > 150 || strlen($field) > 100 || strlen($result) > 30) {
        history_response(400, ['status' => false, 'message' => 'One or more education fields are too long']);
    }
    $passingYear = null;
    if ($passingYearValue !== '') {
        $passingYear = filter_var($passingYearValue, FILTER_VALIDATE_INT);
        if ($passingYear === false || $passingYear < 1901 || $passingYear > 2155) {
            history_response(400, ['status' => false, 'message' => 'Enter a valid passing year']);
        }
    }
    $field = $field === '' ? null : $field;
    $result = $result === '' ? null : $result;

    if ($id) {
        $statement = $cc->conn->prepare(
            'UPDATE education SET degree = ?, institution = ?, field = ?, passing_year = ?, result = ? WHERE id = ? AND seeker_id = ?'
        );
        if (!$statement) {
            error_log('Unable to prepare education update: ' . $cc->conn->error);
            history_response(500, ['status' => false, 'message' => 'Unable to save education']);
        }
        $statement->bind_param('sssssii', $degree, $institution, $field, $passingYear, $result, $id, $seekerId);
    } else {
        $statement = $cc->conn->prepare(
            'INSERT INTO education (seeker_id, degree, institution, field, passing_year, result) VALUES (?, ?, ?, ?, ?, ?)'
        );
        if (!$statement) {
            error_log('Unable to prepare education insert: ' . $cc->conn->error);
            history_response(500, ['status' => false, 'message' => 'Unable to save education']);
        }
        $statement->bind_param('isssss', $seekerId, $degree, $institution, $field, $passingYear, $result);
    }
} else {
    $companyName = trim($_POST['company_name'] ?? '');
    $position = trim($_POST['position'] ?? '');
    $startDate = trim($_POST['start_date'] ?? '');
    $endDate = trim($_POST['end_date'] ?? '');
    $isCurrent = isset($_POST['is_current']) && $_POST['is_current'] === '1' ? 1 : 0;
    $description = trim($_POST['description'] ?? '');

    if ($companyName === '' || $position === '' || !valid_history_date($startDate)) {
        history_response(400, ['status' => false, 'message' => 'Company, position, and a valid start date are required']);
    }
    if (strlen($companyName) > 150 || strlen($position) > 100 || strlen($description) > 65535) {
        history_response(400, ['status' => false, 'message' => 'One or more experience fields are too long']);
    }
    if ($isCurrent) {
        $endDate = null;
    } elseif ($endDate !== '') {
        if (!valid_history_date($endDate) || $endDate < $startDate) {
            history_response(400, ['status' => false, 'message' => 'Enter a valid end date after the start date']);
        }
    } else {
        $endDate = null;
    }
    $description = $description === '' ? null : $description;

    if ($id) {
        $statement = $cc->conn->prepare(
            'UPDATE experience SET company_name = ?, position = ?, start_date = ?, end_date = ?, is_current = ?, description = ? WHERE id = ? AND seeker_id = ?'
        );
        if (!$statement) {
            error_log('Unable to prepare experience update: ' . $cc->conn->error);
            history_response(500, ['status' => false, 'message' => 'Unable to save experience']);
        }
        $statement->bind_param('ssssisii', $companyName, $position, $startDate, $endDate, $isCurrent, $description, $id, $seekerId);
    } else {
        $statement = $cc->conn->prepare(
            'INSERT INTO experience (seeker_id, company_name, position, start_date, end_date, is_current, description) VALUES (?, ?, ?, ?, ?, ?, ?)'
        );
        if (!$statement) {
            error_log('Unable to prepare experience insert: ' . $cc->conn->error);
            history_response(500, ['status' => false, 'message' => 'Unable to save experience']);
        }
        $statement->bind_param('issssis', $seekerId, $companyName, $position, $startDate, $endDate, $isCurrent, $description);
    }
}

if (!$statement->execute()) {
    error_log("Unable to save $type record: " . $statement->error);
    $statement->close();
    history_response(500, ['status' => false, 'message' => "Unable to save $type"]);
}
if (!$id) {
    $id = $cc->conn->insert_id;
}
$statement->close();

$recordStatement = $cc->conn->prepare(
    "SELECT {$tables[$type]['columns']} FROM $table WHERE id = ? AND seeker_id = ? AND deleted_at IS NULL LIMIT 1"
);
if (!$recordStatement) {
    error_log("Unable to prepare saved $type query: " . $cc->conn->error);
    history_response(500, ['status' => false, 'message' => "$type saved, but unable to reload it"]);
}
$recordStatement->bind_param('ii', $id, $seekerId);
if (!$recordStatement->execute()) {
    error_log("Unable to execute saved $type query: " . $recordStatement->error);
    $recordStatement->close();
    history_response(500, ['status' => false, 'message' => "$type saved, but unable to reload it"]);
}
$record = $recordStatement->get_result()->fetch_assoc();
$recordStatement->close();
history_response(200, ['status' => true, 'data' => $record]);
