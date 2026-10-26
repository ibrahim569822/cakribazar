<?php
include '../connection.php';
require_once '../require-authenticated-user.php';

$user = require_authenticated_user($cc->conn);
if ((int) $user['role'] !== 1) {
    http_response_code(403);
    echo json_encode(['status' => false, 'message' => 'Only seekers can view their applications']);
    exit;
}

$query = 'SELECT applications.*, jobs.title AS job_title, users.name AS seeker_name, users.email AS seeker_email
    FROM applications
    JOIN jobs ON jobs.id = applications.job_id
    JOIN users ON users.id = applications.seeker_id
    WHERE applications.seeker_id = ? AND applications.deleted_at IS NULL
    ORDER BY applications.id ASC';
$statement = $cc->conn->prepare($query);
if (!$statement) {
    http_response_code(500);
    echo json_encode(['status' => false, 'message' => 'Unable to load applications']);
    exit;
}

$statement->bind_param('i', $user['id']);
$executed = $statement->execute();
if (!$executed) {
    $statement->close();
    http_response_code(500);
    echo json_encode(['status' => false, 'message' => 'Unable to load applications']);
    exit;
}
$result = $statement->get_result();
$applications = $result->fetch_all(MYSQLI_ASSOC);
$statement->close();

if (($_GET['stream'] ?? '') === '1') {
    header('Content-Type: text/event-stream; charset=utf-8');
    header('Cache-Control: no-cache, no-transform');
    header('X-Accel-Buffering: no');
    ini_set('zlib.output_compression', '0');
    while (ob_get_level() > 0) {
        ob_end_flush();
    }
    set_time_limit(30);

    $lastStatusSnapshot = null;
    $streamStartedAt = time();
    while (!connection_aborted() && time() - $streamStartedAt < 25) {
        $statusSnapshot = array_map(
            static fn($application) => [
                'id' => (int) $application['id'],
                'status' => (int) $application['status'],
            ],
            $applications
        );
        $snapshotJson = json_encode($statusSnapshot);

        if ($snapshotJson !== $lastStatusSnapshot) {
            echo 'data: ' . json_encode(['data' => $statusSnapshot]) . "\n\n";
            $lastStatusSnapshot = $snapshotJson;
            if (ob_get_level() > 0) {
                ob_flush();
            }
            flush();
        }

        if (connection_aborted()) {
            break;
        }
        sleep(1);

        $statement = $cc->conn->prepare($query);
        if (!$statement) {
            error_log('Unable to prepare application status stream query');
            echo "event: error\ndata: {\"message\":\"Unable to fetch application statuses\"}\n\n";
            if (ob_get_level() > 0) {
                ob_flush();
            }
            flush();
            break;
        }
        $statement->bind_param('i', $user['id']);
        if (!$statement->execute()) {
            error_log('Unable to execute application status stream query: ' . $statement->error);
            $statement->close();
            echo "event: error\ndata: {\"message\":\"Unable to fetch application statuses\"}\n\n";
            if (ob_get_level() > 0) {
                ob_flush();
            }
            flush();
            break;
        }
        $result = $statement->get_result();
        $applications = $result->fetch_all(MYSQLI_ASSOC);
        $statement->close();
    }
    exit;
}

echo json_encode(['status' => true, 'data' => $applications]);