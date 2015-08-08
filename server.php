<?php

//add your code here
$f=fopen("chatroom.xml","r");

//read content of the file
$info=fgets($f);

//output to the polling request
echo $info;

//close the file
fclose($f);

?>
