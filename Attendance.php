<?php
include "db.php";
session_start();

$employee_id = $_SESSION['employee_id'];

if(isset($_POST['checkin'])){
    $date = date("Y-m-d");
    $time = date("H:i:s");

    $sql = "INSERT INTO attendance(employee_id,attendance_date,check_in,status)
            VALUES('$employee_id','$date','$time','Present')";

    mysqli_query($conn,$sql);
}

if(isset($_POST['checkout'])){
    $date = date("Y-m-d");
    $time = date("H:i:s");

    mysqli_query($conn,"UPDATE attendance
        SET check_out='$time'
        WHERE employee_id='$employee_id'
        AND attendance_date='$date'");
}
?>

<!DOCTYPE html>
<html>
<head>
<title>Attendance</title>
<style>
body{
    font-family:Arial;
    background:#f5f5f5;
}
.container{
    width:400px;
    margin:auto;
    background:white;
    padding:20px;
    margin-top:50px;
    border-radius:10px;
}
button{
    width:100%;
    padding:10px;
    margin-top:10px;
    background:#007bff;
    color:white;
    border:none;
    cursor:pointer;
}
table{
    width:100%;
    margin-top:20px;
}
</style>
</head>
<body>

<div class="container">

<h2>Attendance Management</h2>

<form method="POST">
<button name="checkin">Check In</button>
<button name="checkout">Check Out</button>
</form>

<h3>My Attendance</h3>

<table border="1">
<tr>
<th>Date</th>
<th>Check In</th>
<th>Check Out</th>
<th>Status</th>
</tr>

<?php

$result=mysqli_query($conn,"SELECT * FROM attendance
WHERE employee_id='$employee_id'
ORDER BY attendance_date DESC");

while($row=mysqli_fetch_assoc($result)){
?>

<tr>
<td><?= $row['attendance_date']; ?></td>
<td><?= $row['check_in']; ?></td>
<td><?= $row['check_out']; ?></td>
<td><?= $row['status']; ?></td>
</tr>

<?php } ?>

</table>

</div>

</body>
</html>
