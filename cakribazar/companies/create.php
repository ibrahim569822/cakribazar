<?php
include '../connection.php';


$uploadDir = '../';
$image="";
if (!empty($_FILES['logo'])) {
    $name = rand().basename($_FILES['logo']['name']);
    $targetPath = 'images/companies/'.$name;

    if (move_uploaded_file($_FILES['logo']['tmp_name'], $uploadDir . $targetPath)) {
        $_POST['logo']=$targetPath;
    }
} 
$res=[];
if($_POST['name']){
    $res=$cc->common_insert('companies', $_POST);
}
echo json_encode($res);