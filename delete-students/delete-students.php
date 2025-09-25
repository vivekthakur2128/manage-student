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

// get data from request
if (isset($_POST['studentId'])) {
    $studentId = $_POST['studentId'];
    if(!empty($studentId)) {
        // prepare and bind
        $stmt = $conn->prepare("DELETE FROM students_info WHERE id = ?");
        $stmt->bind_param("i", $studentId);
        if ($stmt->execute()) {
            echo json_encode(["success" => true]);
        } else {
            echo json_encode(["success" => false, "error" => $stmt->error]);
        }
        $stmt->close();
    } else {
        echo json_encode(["success" => false, "error" => "Empty studentId"]);
    }
} else {
    echo "studentId not received";
}
// reset ids to be sequential after deletion

// Step 1: Update ids to be sequential
$conn->query("SET @count = 0");
$conn->query("UPDATE students_info SET id = @count:= @count + 1 ORDER BY id");

// Step 2: Reset AUTO_INCREMENT to the max id + 1
$conn->query("ALTER TABLE students_info AUTO_INCREMENT = 1");
?>