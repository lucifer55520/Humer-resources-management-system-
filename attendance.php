<?php
include "db.php";
session_start();

// Ensure user is logged in
if (!isset($_SESSION['employee_id'])) {
    die("Please log in to track attendance.");
}

$employee_id = $_SESSION['employee_id'];

if($_SERVER['REQUEST_METHOD'] == 'POST'){
    $date = date("Y-m-d");
    $time = date("H:i:s");

    if(isset($_POST['checkin'])){
        $sql = "INSERT INTO attendance (employee_id, attendance_date, check_in, status)
                VALUES ('$employee_id', '$date', '$time', 'Present')";
        mysqli_query($conn, $sql);
    }

    if(isset($_POST['checkout'])){
        $sql = "UPDATE attendance 
                SET check_out='$time' 
                WHERE employee_id='$employee_id' AND attendance_date='$date'";
        mysqli_query($conn, $sql);
    }
}
?>