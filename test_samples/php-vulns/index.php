<?php
// Intentionally insecure PHP script for testing analyzers only.
// DO NOT DEPLOY. Displays detailed errors and uses unsafe SQL construction.

ini_set('display_errors', 1);
error_reporting(E_ALL);

$host = "127.0.0.1";
$user = "root";
$pass = "";       // hardcoded secret (bad)
$db   = "vuln_demo";

$conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}

$email = $_GET['email'] ?? '';
$password = $_GET['password'] ?? '';

// INTENTIONALLY VULNERABLE: SQL built by concatenation — SQL Injection.
$sql = "SELECT id, email FROM users WHERE email = '" . $email . "' AND password = '" . $password . "'";

$result = $conn->query($sql);
if (!$result) {
  die("Query error: " . $conn->error); // verbose error leak
}

if ($row = $result->fetch_assoc()) {
  echo "Welcome, " . htmlspecialchars($row['email']);
} else {
  echo "Invalid login.";
}

$conn->close();
