<?php
$userId = $_POST['userId'] ?? '';
$pass = $_POST['pass'] ?? '';

// database connection
$host     = 'localhost';
$username = 'root';
$password = '';
$database = 'admin_panel';

$mysqli = new mysqli($host, $username, $password, $database);

// Check connection
if ($mysqli->connect_errno) {
    die("Connection failed: " . $mysqli->connect_error);
}
// prepare sql queries and bind parameters
$stmt = $mysqli->prepare("SELECT * FROM admin WHERE username = ? AND password = ?");
if (!$stmt) {
    die("Prepare failed: " . $mysqli->error);
}
$stmt->bind_param('ss', $userId, $pass);
$stmt->execute();

// Fetch result
$result = $stmt->get_result();
if ($row = $result->fetch_assoc()) {
    echo "Logged in";
} else {
    echo "userId or password is incorrect";
}
// close connection
$stmt->close();
$mysqli->close();
?>
