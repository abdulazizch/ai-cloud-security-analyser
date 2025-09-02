CREATE DATABASE IF NOT EXISTS vuln_demo;
USE vuln_demo;

DROP TABLE IF EXISTS users;
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL
);

INSERT INTO users (email, password) VALUES
('admin@example.com', 'admin123'),
('user@example.com', 'password');
