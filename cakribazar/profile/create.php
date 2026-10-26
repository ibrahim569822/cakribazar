<?php
include '../connection.php';


$uploadDir = '../';
$image="";
if (!empty($_FILES['image'])) {
    $name = rand().basename($_FILES['image']['name']);
    $targetPath = 'images/profile/'.$name;

    if (move_uploaded_file($_FILES['image']['tmp_name'], $uploadDir . $targetPath)) {
        $_POST['image']=$targetPath;
    }
} 
$res=[];
if($_POST['user_id']){
    $res=$cc->common_insert('seeker_profiles', $_POST);
}
echo json_encode($res);