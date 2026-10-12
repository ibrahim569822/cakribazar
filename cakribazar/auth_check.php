<?php

$headers = getallheaders();
// Access the Authorization header
$authHeader = isset($headers['Authorization']) ? $headers['Authorization'] : null;
if ($authHeader && preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
    $accessToken = $matches[1];

	$authquery="select * from users where remember_token='$accessToken'";
	$authresult=$db->query($authquery);
    $access_user_id="";
	if($authresult->num_rows > 0){
		while($r=$authresult->fetch_object()){
			$access_user_id=$r->id;
		}
        
	}else{
        echo json_encode(array("message" => "Token is not available in database.",'error'=>1));
        exit;
    }
}else{
    echo json_encode(array("message" => "Token is not available in database.",'error'=>1));
    exit;
}