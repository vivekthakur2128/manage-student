<?php
header('Content-Type: application/json');
$servername = "localhost";
$username   = "root";
$password   = "";
$dbname     = "students";
$conn = new mysqli($servername, $username, $password, $dbname);
// Check connection
if ($conn->connect_error) {
    die(json_encode(["error" => "Connection failed: " . $conn->connect_error]));
}
// Handle POST request
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $data = json_decode(file_get_contents("php://input"), true);

    // get mysql table header
    $tbHeader = "SHOW COLUMNS FROM students_info";
    $header = $conn->query($tbHeader);
    if ($header->num_rows > 0) {
        while ($headerRow = $header->fetch_assoc()) {
            $tableHeader[] = $headerRow['Field'];
        }
    }
    // Access variables
    $columnName = $data['columnName'] ?? null;
    $columnValue = $data['columnValue'] ?? null;
    // Prepare and bind
    $sql = "SELECT * FROM students_info WHERE `$columnName` = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $columnValue);
    $stmt->execute();
    $result = $stmt->get_result();
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $studentsDataArray[] = $row;
        }
        if($tableHeader && $studentsDataArray){
            $studentsArray = [$tableHeader, $studentsDataArray];
            echo json_encode($studentsArray);
        }
    }
    else {
        echo json_encode("No matching records found for $columnName as $columnValue.");
    }
    $stmt->close();
}

$conn->close();
?>