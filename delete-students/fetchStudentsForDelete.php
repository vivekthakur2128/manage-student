<?php
// create dtabase connection
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "students";
$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
// get table header data from database
$headerColumnsSql = "SHOW COLUMNS FROM students_info";
$headerColumnsResult = $conn->query($headerColumnsSql);
$tableHeader = [];
if ($headerColumnsResult->num_rows > 0) {
    while($row = $headerColumnsResult->fetch_assoc()) {
        // echo $row['Field'] . "\n";
        $tableHeader[] = $row['Field'];
    }
} 
// echo $tableHeader . "\n";
// Fetch all students from the database
$sql = "SELECT * FROM students_info";
$result = $conn->query($sql);
$studentsData = [];
if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $studentsData[] = $row;
        // echo ($row);
    }
}
// echo $studentsData;
$studentsTableDetails = [$tableHeader, $studentsData];
echo json_encode($studentsTableDetails);
$conn->close();
?>