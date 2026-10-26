<?php
include '../connection.php';


$uploadDir = '../';
$image="";
if (!empty($_FILES['resume'])) {
    $name = rand().basename($_FILES['resume']['name']);
    $targetPath = 'images/applications/'.$name;

    if (move_uploaded_file($_FILES['resume']['tmp_name'], $uploadDir . $targetPath)) {
        $_POST['resume']=$targetPath;
    }
} 
$res=[];
if($_POST['job_id'] && $_POST['seeker_id']){
    $res=$cc->common_insert('applications', $_POST);
}
echo json_encode($res);