<?php

header('Content-Type: application/json; charset=UTF-8');
require_once __DIR__ . '/../connection.php';
require_once __DIR__ . '/../require-authenticated-user.php';

function profile_save_response($status, $body)
{
    http_response_code($status);
    echo json_encode($body);
    exit;
}

function profile_save_failure($connection, $status, $message, $uploadedImagePath = null)
{
    $connection->rollback();
    if ($uploadedImagePath && file_exists($uploadedImagePath)) {
        unlink($uploadedImagePath);
    }
    profile_save_response($status, ['status' => false, 'message' => $message]);
}

$user = require_authenticated_user($cc->conn);
if ((int) $user['role'] !== 1) {
    profile_save_response(403, ['status' => false, 'message' => 'Only seekers can update this profile']);
}
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Allow: POST, OPTIONS');
    profile_save_response(405, ['status' => false, 'message' => 'Method not allowed']);
}

$name = trim($_POST['name'] ?? '');
$username = trim($_POST['username'] ?? '');
$jobTitle = trim($_POST['job_title'] ?? '');
$dateOfBirthValue = trim($_POST['date_of_birth'] ?? '');
$genderValue = trim($_POST['gender'] ?? '');
$summary = trim($_POST['summary'] ?? '');
$address = trim($_POST['address'] ?? '');
$country = trim($_POST['country'] ?? '');
$twitter = trim($_POST['twitter'] ?? '');
$linkedin = trim($_POST['linkedin'] ?? '');

if ($name === '' || $username === '') {
    profile_save_response(400, ['status' => false, 'message' => 'Name and username are required']);
}
if (strlen($name) > 100 || strlen($username) > 255) {
    profile_save_response(400, ['status' => false, 'message' => 'Name or username is too long']);
}
if (strlen($jobTitle) > 150 || strlen($summary) > 10000 || strlen($address) > 255 ||
    strlen($country) > 100 || strlen($twitter) > 255 || strlen($linkedin) > 255) {
    profile_save_response(400, ['status' => false, 'message' => 'One or more profile fields are too long']);
}

$dateOfBirth = null;
if ($dateOfBirthValue !== '') {
    $parsedDate = DateTime::createFromFormat('!Y-m-d', $dateOfBirthValue);
    if (!$parsedDate || $parsedDate->format('Y-m-d') !== $dateOfBirthValue) {
        profile_save_response(400, ['status' => false, 'message' => 'Enter a valid date of birth']);
    }
    $dateOfBirth = $dateOfBirthValue;
}

$gender = null;
if ($genderValue !== '') {
    if (!in_array($genderValue, ['1', '2', '3'], true)) {
        profile_save_response(400, ['status' => false, 'message' => 'Choose a valid gender']);
    }
    $gender = $genderValue;
}

$userId = (int) $user['id'];
if (!$cc->conn->begin_transaction()) {
    error_log('Unable to start seeker profile transaction: ' . $cc->conn->error);
    profile_save_response(500, ['status' => false, 'message' => 'Unable to save profile changes']);
}
$profileQuery = $cc->conn->prepare('SELECT image FROM seeker_profiles WHERE user_id = ? LIMIT 1');
if (!$profileQuery) {
    error_log('Unable to prepare seeker profile lookup: ' . $cc->conn->error);
    profile_save_failure($cc->conn, 500, 'Unable to save profile changes');
}
$profileQuery->bind_param('i', $userId);
if (!$profileQuery->execute()) {
    error_log('Unable to execute seeker profile lookup: ' . $profileQuery->error);
    $profileQuery->close();
    profile_save_failure($cc->conn, 500, 'Unable to save profile changes');
}
$existingProfile = $profileQuery->get_result()->fetch_assoc();
$profileQuery->close();

$image = $existingProfile['image'] ?? null;
$uploadedImagePath = null;
if (isset($_FILES['image']) && $_FILES['image']['error'] !== UPLOAD_ERR_NO_FILE) {
    if ($_FILES['image']['error'] !== UPLOAD_ERR_OK || $_FILES['image']['size'] > 5 * 1024 * 1024) {
        profile_save_failure($cc->conn, 400, 'The image must be no larger than 5 MB');
    }

    $fileInfo = new finfo(FILEINFO_MIME_TYPE);
    $mimeType = $fileInfo->file($_FILES['image']['tmp_name']);
    $extensions = [
        'image/jpeg' => 'jpg',
        'image/png' => 'png',
        'image/webp' => 'webp',
    ];
    if (!isset($extensions[$mimeType])) {
        profile_save_failure($cc->conn, 400, 'Upload a JPG, PNG, or WebP image');
    }

    $imageDirectory = __DIR__ . '/../images/profiles';
    if (!is_dir($imageDirectory) && !mkdir($imageDirectory, 0755, true)) {
        error_log('Unable to create seeker profile image directory');
        profile_save_failure($cc->conn, 500, 'Unable to save profile image');
    }
    $filename = bin2hex(random_bytes(16)) . '.' . $extensions[$mimeType];
    $uploadedImagePath = $imageDirectory . '/' . $filename;
    if (!move_uploaded_file($_FILES['image']['tmp_name'], $uploadedImagePath)) {
        error_log('Unable to move uploaded seeker profile image');
        profile_save_failure($cc->conn, 500, 'Unable to save profile image');
    }
    $image = 'images/profiles/' . $filename;
}

$userUpdate = $cc->conn->prepare('UPDATE users SET name = ?, username = ? WHERE id = ?');
if (!$userUpdate) {
    error_log('Unable to prepare user profile update: ' . $cc->conn->error);
    profile_save_failure($cc->conn, 500, 'Unable to save profile changes', $uploadedImagePath);
}
$userUpdate->bind_param('ssi', $name, $username, $userId);
if (!$userUpdate->execute()) {
    error_log('Unable to update user profile: ' . $userUpdate->error);
    $status = $cc->conn->errno === 1062 ? 409 : 500;
    $userUpdate->close();
    profile_save_failure($cc->conn, $status, $status === 409 ? 'That username is already in use' : 'Unable to save profile changes', $uploadedImagePath);
}
$userUpdate->close();

if ($existingProfile) {
    $profileSave = $cc->conn->prepare(
        'UPDATE seeker_profiles SET job_title = ?, date_of_birth = ?, gender = ?, summary = ?, address = ?, country = ?, twitter = ?, linkedin = ?, image = ?, deleted_at = NULL WHERE user_id = ?'
    );
    if (!$profileSave) {
        error_log('Unable to prepare seeker profile update: ' . $cc->conn->error);
        profile_save_failure($cc->conn, 500, 'Unable to save profile changes', $uploadedImagePath);
    }
    $profileSave->bind_param('sssssssssi', $jobTitle, $dateOfBirth, $gender, $summary, $address, $country, $twitter, $linkedin, $image, $userId);
} else {
    $profileSave = $cc->conn->prepare(
        'INSERT INTO seeker_profiles (user_id, job_title, date_of_birth, gender, summary, address, country, twitter, linkedin, image) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
    );
    if (!$profileSave) {
        error_log('Unable to prepare seeker profile insert: ' . $cc->conn->error);
        profile_save_failure($cc->conn, 500, 'Unable to save profile changes', $uploadedImagePath);
    }
    $profileSave->bind_param('isssssssss', $userId, $jobTitle, $dateOfBirth, $gender, $summary, $address, $country, $twitter, $linkedin, $image);
}
try {
    $saved = $profileSave->execute();
} catch (mysqli_sql_exception $error) {
    error_log('Unable to save seeker profile for user ' . $userId . ': ' . $error->getMessage());
    $profileSave->close();
    profile_save_failure($cc->conn, 500, 'Unable to save profile changes', $uploadedImagePath);
}
if (!$saved) {
    error_log('Unable to save seeker profile: ' . $profileSave->error);
    $profileSave->close();
    profile_save_failure($cc->conn, 500, 'Unable to save profile changes', $uploadedImagePath);
}
$profileSave->close();

$profileQuery = $cc->conn->prepare(
    'SELECT id, user_id, job_title, date_of_birth, gender, summary, address, country, twitter, linkedin, image FROM seeker_profiles WHERE user_id = ? LIMIT 1'
);
if (!$profileQuery) {
    error_log('Unable to prepare saved seeker profile lookup: ' . $cc->conn->error);
    profile_save_failure($cc->conn, 500, 'Unable to save profile changes', $uploadedImagePath);
}
$profileQuery->bind_param('i', $userId);
if (!$profileQuery->execute()) {
    error_log('Unable to retrieve saved seeker profile: ' . $profileQuery->error);
    $profileQuery->close();
    profile_save_failure($cc->conn, 500, 'Unable to save profile changes', $uploadedImagePath);
}
$savedProfile = $profileQuery->get_result()->fetch_assoc();
$profileQuery->close();

if (!$cc->conn->commit()) {
    error_log('Unable to commit seeker profile changes: ' . $cc->conn->error);
    profile_save_failure($cc->conn, 500, 'Unable to save profile changes', $uploadedImagePath);
}

profile_save_response(200, [
    'status' => true,
    'user' => ['name' => $name, 'username' => $username],
    'profile' => $savedProfile,
]);
