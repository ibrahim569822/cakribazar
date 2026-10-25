<?php

function require_authenticated_user($connection)
{
    $headers = function_exists('getallheaders') ? getallheaders() : [];
    $authorization = '';

    foreach ($headers as $name => $value) {
        if (strtolower($name) === 'authorization') {
            $authorization = $value;
            break;
        }
    }
    if ($authorization === '') {
        $authorization = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
    }

    if (!preg_match('/^Bearer\s+(\S+)$/i', $authorization, $matches)) {
        http_response_code(401);
        echo json_encode(['status' => false, 'message' => 'Authentication required']);
        exit;
    }

    $statement = $connection->prepare(
        'SELECT id, role FROM users WHERE remember_token = ? AND status = 1 AND deleted_at IS NULL LIMIT 1'
    );
    if (!$statement) {
        error_log('Unable to prepare authenticated-user query: ' . $connection->error);
        http_response_code(500);
        echo json_encode(['status' => false, 'message' => 'Unable to authenticate user']);
        exit;
    }

    $statement->bind_param('s', $matches[1]);
    if (!$statement->execute()) {
        error_log('Unable to execute authenticated-user query: ' . $statement->error);
        $statement->close();
        http_response_code(500);
        echo json_encode(['status' => false, 'message' => 'Unable to authenticate user']);
        exit;
    }

    $user = $statement->get_result()->fetch_assoc();
    $statement->close();

    if (!$user) {
        http_response_code(401);
        echo json_encode(['status' => false, 'message' => 'Invalid authentication token']);
        exit;
    }

    return $user;
}
