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
        // get mysql table header
        $tbHeader = "SHOW COLUMNS FROM students_info";
        $header = $conn->query($tbHeader);
        if ($header->num_rows > 0) {
        while ($headerRow = $header->fetch_assoc()) {
                $tableHeader[] = $headerRow['Field'];
            }
        }
        $receivedDataArray = $data['data'];
        if (!(is_array($receivedDataArray))) {
            $sql = "SELECT * FROM students_info";
            $result = $conn->query($sql);
            if ($result->num_rows > 0) {
                while ($tableRow = $result->fetch_assoc()) {
                    $allRowsData[] = $tableRow;
                }
            }
        }
        if ((is_array($receivedDataArray)) && (count($receivedDataArray) === 2)) {
            $columnName = $receivedDataArray[0];
            $columnValue = $receivedDataArray[1];
            if($columnName !== "month"){
                $sql = "SELECT * FROM students_info where $columnName = ?";
                $stmt = $conn->prepare($sql);
                $stmt->bind_param("s", $columnValue);
            }
            else{
                // split date into two parts starDate and endDate
                $parts = explode("-", $columnValue);
                // if(count($parts) !== 2){
                //     echo json_encode("Invalid month format. Please use YYYY-MM format.");
                //     return;
                // }
                if(count($parts) === 1){
                    $year = $parts[0];
                    $sql = "SELECT * FROM students_info where year(date) = ?";
                    $stmt = $conn->prepare($sql);
                    $stmt->bind_param("i", $year);
                }
                if(count($parts) === 2){
                    $year = $parts[0];
                    $month = $parts[1];
                    $sql = "SELECT * FROM students_info where year(date) = ? AND month(date) = ?";
                    $stmt = $conn->prepare($sql);
                    $stmt->bind_param("ii", $year, $month);
                }
            }
            $stmt->execute();
            $result = $stmt->get_result();
            if ($result->num_rows > 0) {
                array_shift($tableHeader); //remove id column
                while ($tableRow = $result->fetch_assoc()) {
                    array_shift($tableRow); // remove id column data
                    $allRowsData[] = $tableRow;
                }
            }
            else{
                if($columnName === "month" && count($parts) === 1){
                    echo json_encode("No record found for year $columnValue");
                    return;
                }
                if($columnName === "month" && count($parts) === 2){
                    echo json_encode("No record found for month $columnValue");
                    return;
                }
                echo json_encode("No record found for $columnName as $columnValue");
                return;
            }

            $stmt->close();
        }
        if($tableHeader && $allRowsData){
            $studentsArray = [$tableHeader, $allRowsData];
            echo json_encode($studentsArray);
        }
    } 
    else {
        echo json_encode(["No matching data in record"]);
    }
}
$conn->close();
?>