<?php
include '../connection.php';


$uploadDir = '../';
$image="";
if (!empty($_FILES['icon'])) {
    $name = rand().basename($_FILES['icon']['name']);
    $targetPath = 'images/category/'.$name;

    if (move_uploaded_file($_FILES['icon']['tmp_name'], $uploadDir . $targetPath)) {
        $_POST['icon']=$targetPath;
    }
} 
$res=[];
if($_POST['name']){
    $res=$cc->common_insert('categories', $_POST);
}
echo json_encode($res);