<?php

if (!isset($_COOKIE["name"])) {
    header("Location: error.html");
    return;
}

// get the name from cookie
$name = isset($_COOKIE["name"]) ? $_COOKIE["name"] : "unkonwn";

// get the message content
$message = $_POST["message"];
if (trim($message) == "") $message = "__EMPTY__";

//write your code here
// open the file(chatroom.xml), which stores the chat message
$f = fopen("chatroom.xml", "r");
// read the file content
$info = fgets($f);

// check the file whether contains content. If the file is empty, then write the first message(an array) into the file
if($info==""){
	$data=array(0=>array("username"=>$name,"message"=>$message,"time"=>time(),));
	file_put_contents("chatroom.xml",json_encode($data));
}else{
	$data=array("username"=>$name,"message"=>$message,"time"=>time(),);
	$d=json_decode($info,true);
	array_push($d,$data);
	file_put_contents("chatroom.xml",json_encode($d));
}

 // If not empty, fetch the existed log,add the new message and then write to the file
	// add the new message

	// write back to the file

// close the file
fclose($f);

?>
