<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "students";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $name = $_POST['fullname'];
    $fathername = $_POST['fathername'];
    $email = $_POST['email'];
    $gender = $_POST['gender'];
    $phone = $_POST['phone'];
    $address = $_POST['address'];
    // Prepare and bind
    $stmt = $conn->prepare("INSERT INTO students_info (name, fathername, email, gender, phone, address) VALUES (?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("ssssis", $name, $fathername, $email, $gender, $phone, $address);
    if ($stmt->execute()) {
        echo "New record created successfully.";
    } else {
        echo "Error: " . $stmt->error;
    }

    $stmt->close();
} else {
    echo "Form not submitted successfully.";
}

$conn->close();
?>
