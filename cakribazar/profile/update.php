<?php
include '../connection.php';

$id=$_GET['id'];
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
    $res=$cc->common_update('seeker_profiles', $_POST, ['user_id'=>$id]);
}
echo json_encode($res);

