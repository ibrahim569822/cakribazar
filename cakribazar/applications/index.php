<?php
include '../connection.php';
$applications_result="select applications.*, jobs.title as job_title, companies.name as company_name, users.name as seeker_name, users.email as seeker_email from applications join jobs on applications.job_id = jobs.id join companies on jobs.company_id = companies.id join users on applications.seeker_id = users.id;";
$result=$cc->common_query($applications_result);
echo json_encode($result);