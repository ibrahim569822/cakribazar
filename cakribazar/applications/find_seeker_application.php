<?php
include '../connection.php';
$seeker_id=$_GET['seeker_id'];
$job_id=$_GET['job_id'];
$sql="select * from applications where seeker_id = $seeker_id and job_id = $job_id";
$result=$cc->common_query($sql);

echo $result['status'];