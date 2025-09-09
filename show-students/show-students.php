<?php
header('Content-Type: application/json');

$servername = "localhost";
$username   = "root";
$password   = "";
$dbname     = "students";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die(json_encode(["error" => "Connection failed: " . $conn->connect_error]));
}

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $json_data = file_get_contents("php://input");
    $data = json_decode($json_data, true);

    if (isset($data['data'])) {
        $receivedDataArray = $data['data'];
        if (count($receivedDataArray) === 1) {
            $sql    = "SELECT * FROM students_info";
            $result = $conn->query($sql);
            if ($result->num_rows > 0) {
                while ($tableRow = $result->fetch_assoc()) {
                    $allRowsData[] = $tableRow;
                }
            }
        }
        if (count($receivedDataArray) === 2) {
            $columnName = $receivedDataArray[0];
            $columnValue = $receivedDataArray[1];
            if($columnName !== "date"){
                $sql = "SELECT * FROM students_info where $columnName = ?";
                $stmt = $conn->prepare($sql);
                $stmt->bind_param("s", $columnValue);
            }
            else{
                // split date into two parts starDate and endDate
                $parts = explode("-", $columnValue);
                $startDate = $parts[0] . "-" . $parts[1] . "-" . $parts[2];
                $endDate = $parts[3] . "-" . $parts[4] . "-" . $parts[5];
                $sql = "SELECT * FROM students_info where $columnName between ? AND ?";
                $stmt = $conn->prepare($sql);
                $stmt->bind_param("ss", $startDate, $endDate);
            }
            $stmt->execute();
            $result = $stmt->get_result();
            if ($result->num_rows > 0) {
                while ($tableRow = $result->fetch_assoc()) {
                    $allRowsData[] = $tableRow;
                }
            }
            $stmt->close();
        }
        echo json_encode($allRowsData);
        
    } else {
        echo json_encode(["No matching data in record"]);
    }
}
$conn->close();
?>