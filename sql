
CREATE DATABASE IF NOT EXISTS hospital_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE hospital_db;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'doctor', 'patient') NOT NULL,
    full_name VARCHAR(100) CHARACTER SET utf8mb4 NOT NULL,
    email VARCHAR(100),
    google_id VARCHAR(100) NULL
);

CREATE TABLE doctors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT, -- Liên kết với bảng users
    specialty VARCHAR(100) CHARACTER SET utf8mb4,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);


CREATE TABLE patients (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT, -- Liên kết với bảng users
    year_birth INT,
    address VARCHAR(255) CHARACTER SET utf8mb4,
    phone VARCHAR(20),
    gender VARCHAR(10),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE schedules (
    id INT AUTO_INCREMENT PRIMARY KEY,
    doctor_id INT,
    date DATE,
    shift VARCHAR(50), -- Sáng / Chiều
    FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE
);

CREATE TABLE appointments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT,
    doctor_id INT NULL,
    time_booked VARCHAR(100), -- Ví dụ: "2025-11-29 (Sáng)"
    symptoms TEXT,
    result TEXT,
    fee DECIMAL(10, 2) DEFAULT 0,
    status ENUM('Chờ khám', 'Đã hủy', 'Hoàn thành') DEFAULT 'Chờ khám',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(id),
    FOREIGN KEY (doctor_id) REFERENCES doctors(id)
);

INSERT INTO users (username, password, role, full_name) VALUES ('admin', '123', 'admin', 'Quản Trị Viên');

INSERT INTO users (username, password, role, full_name) VALUES ('bs_Đức', '123', 'doctor', 'Dr. Nguyễn Minh Đức');
INSERT INTO doctors (user_id, specialty) VALUES (LAST_INSERT_ID(), 'Tim mạch');

INSERT INTO users (username, password, role, full_name) VALUES ('bs_Trường', '123', 'doctor', 'Dr. Nguyễn Đức Trường');
INSERT INTO doctors (user_id, specialty) VALUES (LAST_INSERT_ID(), 'Nhi khoa');

INSERT INTO users (username, password, role, full_name) VALUES ('bs_Đại', '123', 'doctor', 'Dr. Lê Đức Đại');
INSERT INTO doctors (user_id, specialty) VALUES (LAST_INSERT_ID(), 'Thần kinh');

INSERT INTO users (username, password, role, full_name) VALUES ('bs_Bách', '123', 'doctor', 'Dr. Lê Xuân Bách');
INSERT INTO doctors (user_id, specialty) VALUES (LAST_INSERT_ID(), 'Da liễu');
ALTER TABLE schedules ADD COLUMN time VARCHAR(20);

