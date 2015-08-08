<?php

// if name is not in the post data, exit
if (!isset($_POST["name"])) {
    header("Location: error.html");
    exit;
}

// set the name to the cookie
setcookie("name", $_POST["name"]);

?>