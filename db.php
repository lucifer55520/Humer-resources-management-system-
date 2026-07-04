<?php
$conn = mysqli_connect("localhost", "root", "", "hrms");

if(!$conn){
    die("Database Connection Failed: " . mysqli_connect_error());
}
?>