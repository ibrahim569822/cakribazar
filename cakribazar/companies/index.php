<?php
include '../connection.php';
$result=$cc->common_select('companies');
echo json_encode($result);