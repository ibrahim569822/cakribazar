<?php

header('Content-Type: application/json; charset=UTF-8');
require_once __DIR__ . '/../connection.php';
require_once __DIR__ . '/../require-authenticated-user.php';

function skills_response($status, $body)
{
    http_response_code($status);
    echo json_encode($body);
    exit;
}

function skills_failure($connection, $status, $message)
{
    $connection->rollback();
    skills_response($status, ['status' => false, 'message' => $message]);
}

$user = require_authenticated_user($cc->conn);
if ((int) $user['role'] !== 1) {
    skills_response(403, ['status' => false, 'message' => 'Only seekers can manage skills']);
}

$method = $_SERVER['REQUEST_METHOD'];
$userId = (int) $user['id'];

if ($method === 'GET') {
    $statement = $cc->conn->prepare(
        'SELECT s.id, s.name FROM skills s INNER JOIN seeker_skills ss ON ss.skill_id = s.id WHERE ss.seeker_id = ? AND ss.deleted_at IS NULL AND s.deleted_at IS NULL ORDER BY s.name'
    );
    if (!$statement) {
        error_log('Unable to prepare seeker skills query: ' . $cc->conn->error);
        skills_response(500, ['status' => false, 'message' => 'Unable to load skills']);
    }
    $statement->bind_param('i', $userId);
    try {
        $statement->execute();
    } catch (mysqli_sql_exception $error) {
        error_log('Unable to load skills for user ' . $userId . ': ' . $error->getMessage());
        $statement->close();
        skills_response(500, ['status' => false, 'message' => 'Unable to load skills']);
    }
    $records = $statement->get_result()->fetch_all(MYSQLI_ASSOC);
    $statement->close();
    skills_response(200, ['status' => true, 'data' => $records]);
}

if ($method === 'DELETE') {
    $skillId = filter_input(INPUT_GET, 'id', FILTER_VALIDATE_INT);
    if (!$skillId || $skillId < 1) {
        skills_response(400, ['status' => false, 'message' => 'A valid skill ID is required']);
    }
    $statement = $cc->conn->prepare(
        'UPDATE seeker_skills SET deleted_at = CURRENT_TIMESTAMP WHERE seeker_id = ? AND skill_id = ? AND deleted_at IS NULL'
    );
    if (!$statement) {
        error_log('Unable to prepare seeker skill removal: ' . $cc->conn->error);
        skills_response(500, ['status' => false, 'message' => 'Unable to remove skill']);
    }
    $statement->bind_param('ii', $userId, $skillId);
    try {
        $statement->execute();
    } catch (mysqli_sql_exception $error) {
        error_log('Unable to remove skill for user ' . $userId . ': ' . $error->getMessage());
        $statement->close();
        skills_response(500, ['status' => false, 'message' => 'Unable to remove skill']);
    }
    $removed = $statement->affected_rows > 0;
    $statement->close();
    if (!$removed) {
        skills_response(404, ['status' => false, 'message' => 'Skill not found']);
    }
    skills_response(200, ['status' => true, 'message' => 'Skill removed']);
}

if ($method !== 'POST') {
    header('Allow: GET, POST, DELETE, OPTIONS');
    skills_response(405, ['status' => false, 'message' => 'Method not allowed']);
}

$name = trim($_POST['name'] ?? '');
if ($name === '' || strlen($name) > 60) {
    skills_response(400, ['status' => false, 'message' => 'Enter a skill name up to 60 characters']);
}

if (!$cc->conn->begin_transaction()) {
    error_log('Unable to start seeker skill transaction: ' . $cc->conn->error);
    skills_response(500, ['status' => false, 'message' => 'Unable to save skill']);
}

$lookup = $cc->conn->prepare('SELECT id FROM skills WHERE name = ? LIMIT 1');
if (!$lookup) {
    error_log('Unable to prepare skill lookup: ' . $cc->conn->error);
    skills_failure($cc->conn, 500, 'Unable to save skill');
}
$lookup->bind_param('s', $name);
try {
    $lookup->execute();
} catch (mysqli_sql_exception $error) {
    error_log('Unable to look up skill: ' . $error->getMessage());
    $lookup->close();
    skills_failure($cc->conn, 500, 'Unable to save skill');
}
$skill = $lookup->get_result()->fetch_assoc();
$lookup->close();

if ($skill) {
    $skillId = (int) $skill['id'];
    $restoreSkill = $cc->conn->prepare('UPDATE skills SET deleted_at = NULL WHERE id = ?');
    if (!$restoreSkill) {
        error_log('Unable to prepare skill restore: ' . $cc->conn->error);
        skills_failure($cc->conn, 500, 'Unable to save skill');
    }
    $restoreSkill->bind_param('i', $skillId);
    try {
        $restoreSkill->execute();
    } catch (mysqli_sql_exception $error) {
        error_log('Unable to restore skill: ' . $error->getMessage());
        $restoreSkill->close();
        skills_failure($cc->conn, 500, 'Unable to save skill');
    }
    $restoreSkill->close();
} else {
    $insertSkill = $cc->conn->prepare('INSERT INTO skills (name) VALUES (?)');
    if (!$insertSkill) {
        error_log('Unable to prepare skill insert: ' . $cc->conn->error);
        skills_failure($cc->conn, 500, 'Unable to save skill');
    }
    $insertSkill->bind_param('s', $name);
    try {
        $insertSkill->execute();
    } catch (mysqli_sql_exception $error) {
        error_log('Unable to insert skill: ' . $error->getMessage());
        $insertSkill->close();
        skills_failure($cc->conn, 500, 'Unable to save skill');
    }
    $skillId = (int) $cc->conn->insert_id;
    $insertSkill->close();
}

$link = $cc->conn->prepare(
    'INSERT INTO seeker_skills (seeker_id, skill_id) VALUES (?, ?) ON DUPLICATE KEY UPDATE deleted_at = NULL'
);
if (!$link) {
    error_log('Unable to prepare seeker skill link: ' . $cc->conn->error);
    skills_failure($cc->conn, 500, 'Unable to save skill');
}
$link->bind_param('ii', $userId, $skillId);
try {
    $linked = $link->execute();
} catch (mysqli_sql_exception $error) {
    error_log('Unable to link skill ' . $skillId . ' to user ' . $userId . ': ' . $error->getMessage());
    $link->close();
    skills_failure($cc->conn, 500, 'Unable to save skill');
}
if (!$linked) {
    error_log('Unable to link seeker skill: ' . $link->error);
    $link->close();
    skills_failure($cc->conn, 500, 'Unable to save skill');
}
$link->close();

$savedSkill = $cc->conn->prepare('SELECT id, name FROM skills WHERE id = ? LIMIT 1');
if (!$savedSkill) {
    error_log('Unable to prepare saved skill query: ' . $cc->conn->error);
    skills_failure($cc->conn, 500, 'Unable to save skill');
}
$savedSkill->bind_param('i', $skillId);
try {
    $savedSkill->execute();
} catch (mysqli_sql_exception $error) {
    error_log('Unable to retrieve saved skill: ' . $error->getMessage());
    $savedSkill->close();
    skills_failure($cc->conn, 500, 'Unable to save skill');
}
$record = $savedSkill->get_result()->fetch_assoc();
$savedSkill->close();

if (!$cc->conn->commit()) {
    error_log('Unable to commit seeker skill: ' . $cc->conn->error);
    skills_failure($cc->conn, 500, 'Unable to save skill');
}
skills_response(200, ['status' => true, 'data' => $record]);
