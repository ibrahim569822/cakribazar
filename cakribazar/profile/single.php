<?php

header('Content-Type: application/json; charset=UTF-8');
require_once __DIR__ . '/../connection.php';
require_once __DIR__ . '/../require-authenticated-user.php';

function single_profile_response($status, $body)
{
    http_response_code($status);
    echo json_encode($body);
    exit;
}

$user = require_authenticated_user($cc->conn);
if ((int) $user['role'] !== 1) {
    single_profile_response(403, ['status' => false, 'message' => 'Only seekers can view this profile']);
}
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    header('Allow: GET, OPTIONS');
    single_profile_response(405, ['status' => false, 'message' => 'Method not allowed']);
}

$statement = $cc->conn->prepare(
    'SELECT id, user_id, job_title, date_of_birth, gender, summary, address, country, twitter, linkedin, image FROM seeker_profiles WHERE user_id = ? AND deleted_at IS NULL LIMIT 1'
);
if (!$statement) {
    error_log('Unable to prepare seeker profile query: ' . $cc->conn->error);
    single_profile_response(500, ['status' => false, 'message' => 'Unable to load profile']);
}
$userId = (int) $user['id'];
$statement->bind_param('i', $userId);
if (!$statement->execute()) {
    error_log('Unable to execute seeker profile query: ' . $statement->error);
    $statement->close();
    single_profile_response(500, ['status' => false, 'message' => 'Unable to load profile']);
}
$profile = $statement->get_result()->fetch_assoc();
$statement->close();

single_profile_response(200, [[
    'status' => true,
    'data' => $profile ? [$profile] : [],
]]);
