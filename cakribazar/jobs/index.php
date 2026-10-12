<?php
include '../connection.php';
$result=$cc->common_select('jobs');
echo json_encode($result);