<?php

include '../connection.php';
require_once '../require-authenticated-user.php';

function application_notifications_response($status, $body)
{
    http_response_code($status);
    echo json_encode($body);
    exit;
}

$user = require_authenticated_user($cc->conn);
if (!in_array((int) $user['role'], [2, 3], true)) {
    application_notifications_response(403, ['status' => false, 'message' => 'Only employers can view application notifications']);
}
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    header('Allow: GET, OPTIONS');
    application_notifications_response(405, ['status' => false, 'message' => 'Method not allowed']);
}

$query = 'SELECT a.id
    FROM applications a
    INNER JOIN jobs j ON j.id = a.job_id
    INNER JOIN companies c ON c.id = j.company_id
    WHERE a.deleted_at IS NULL AND j.deleted_at IS NULL AND c.deleted_at IS NULL';
if ((int) $user['role'] === 2) {
    $query .= ' AND c.user_id = ?';
}
$query .= ' ORDER BY a.id ASC';

$statement = $cc->conn->prepare($query);
if (!$statement) {
    error_log('Unable to prepare application notifications query: ' . $cc->conn->error);
    application_notifications_response(500, ['status' => false, 'message' => 'Unable to load application notifications']);
}
if ((int) $user['role'] === 2) {
    $statement->bind_param('i', $user['id']);
}
try {
    $statement->execute();
} catch (mysqli_sql_exception $error) {
    error_log('Unable to load application notifications for user ' . $user['id'] . ': ' . $error->getMessage());
    $statement->close();
    application_notifications_response(500, ['status' => false, 'message' => 'Unable to load application notifications']);
}

$rows = $statement->get_result()->fetch_all(MYSQLI_ASSOC);
$statement->close();
$applicationIds = array_map(static fn($row) => (int) $row['id'], $rows);
application_notifications_response(200, ['status' => true, 'data' => $applicationIds]);
