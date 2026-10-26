<?php
include '../connection.php';
$result=$cc->common_select('users','*','id=?',[$_SESSION['user_id']]);
echo json_encode($result);