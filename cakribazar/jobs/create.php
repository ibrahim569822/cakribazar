<?php
include '../connection.php';


$uploadDir = '../';
$image="";
if (!empty($_FILES['icon'])) {
    $name = rand().basename($_FILES['icon']['name']);
    $targetPath = 'images/jobs/'.$name;

    if (move_uploaded_file($_FILES['icon']['tmp_name'], $uploadDir . $targetPath)) {
        $_POST['icon']=$targetPath;
    }
} 
$res=[];
if($_POST['title']){
    $res=$cc->common_insert('jobs', $_POST);
}
echo json_encode($res);