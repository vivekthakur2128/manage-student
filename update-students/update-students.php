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
// Handle POST request
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $data = json_decode(file_get_contents("php://input"), true);
    // Access variables
    $id = $data['id'] ?? null;
    $name = $data['name'] ?? null;
    $fathername = $data['fathername'] ?? null;
    $email = $data['email'] ?? null;
    $gender = $data['gender'] ?? null;
    $phone = $data['phone'] ?? null;
    $address = $data['address'] ?? null;
    // Prepare and bind
    $sql = "UPDATE students_info SET name = ?, fathername = ?, email = ?, gender = ?, phone = ?, address = ? WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ssssssi", $name, $fathername, $email, $gender, $phone, $address, $id);
    if ($stmt->execute()) {
        echo json_encode("Record updated successfully");
    } else {
        echo json_encode("Error updating record: " . $stmt->error);
    }
    $stmt->close();
}
$conn->close();
?>