<?php
include '../connection.php';

$id=$_GET['id'];
$uploadDir = '../';
$image="";
if (!empty($_FILES['icon'])) {
    $name = rand().basename($_FILES['icon']['name']);
    $targetPath = 'images/companies/'.$name;

    if (move_uploaded_file($_FILES['icon']['tmp_name'], $uploadDir . $targetPath)) {
        $_POST['icon']=$targetPath;
    }
} 
$res=[];
if($_POST['name']){
    $res=$cc->common_update('companies', $_POST, ['id'=>$id]);
}
echo json_encode($res);

