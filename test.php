<?php

$servername = 'localhost';
$username = "root";
$password = "OURsql";
$dbname = "MusicDB";

//Connecting to DB
$conn = new mysqli($servername, $username, $password, $dbname) or die("Unable");

echo "Great work!!";
?>