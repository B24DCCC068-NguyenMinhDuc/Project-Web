SET FOREIGN_KEY_CHECKS = 0;

DROP DATABASE IF EXISTS hospital_db;

CREATE DATABASE IF NOT EXISTS hospital_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE hospital_db;


CREATE TABLE IF NOT EXISTS users (
  id INT NOT NULL AUTO_INCREMENT,
  username VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'doctor', 'patient') NOT NULL,
  full_name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NULL DEFAULT NULL,
  google_id VARCHAR(100) NULL DEFAULT NULL,
  PRIMARY KEY (id)
) ENGINE = InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE IF NOT EXISTS patients (
  id INT NOT NULL AUTO_INCREMENT,
  user_id INT NULL DEFAULT NULL,
  year_birth INT NULL DEFAULT NULL,
  address VARCHAR(255) NULL DEFAULT NULL,
  phone VARCHAR(20) NULL DEFAULT NULL,
  gender VARCHAR(10) NULL DEFAULT NULL,
  PRIMARY KEY (id),
  CONSTRAINT patients_fk_user
    FOREIGN KEY (user_id)
    REFERENCES users (id)
    ON DELETE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE IF NOT EXISTS doctors (
  id INT NOT NULL AUTO_INCREMENT,
  user_id INT NULL DEFAULT NULL,
  specialty VARCHAR(100) NULL DEFAULT NULL,
  PRIMARY KEY (id),
  CONSTRAINT doctors_fk_user
    FOREIGN KEY (user_id)
    REFERENCES users (id)
    ON DELETE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE IF NOT EXISTS appointments (
  id INT NOT NULL AUTO_INCREMENT,
  patient_id INT NULL DEFAULT NULL,
  doctor_id INT NULL DEFAULT NULL,
  time_booked VARCHAR(100) NULL DEFAULT NULL,
  symptoms TEXT NULL DEFAULT NULL,
  result TEXT NULL DEFAULT NULL,
  fee DECIMAL(10,2) DEFAULT 0.00,
  status ENUM('Chờ khám', 'Đã hủy', 'Hoàn thành') DEFAULT 'Chờ khám',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  specialty VARCHAR(100) NULL DEFAULT NULL,
  PRIMARY KEY (id),
  CONSTRAINT appointments_fk_patient
    FOREIGN KEY (patient_id)
    REFERENCES patients (id)
    ON DELETE SET NULL, -- Nếu xóa bệnh nhân, lịch sử vẫn còn (hoặc CASCADE tùy bạn)
  CONSTRAINT appointments_fk_doctor
    FOREIGN KEY (doctor_id)
    REFERENCES doctors (id)
    ON DELETE SET NULL
) ENGINE = InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE IF NOT EXISTS schedules (
  id INT NOT NULL AUTO_INCREMENT,
  doctor_id INT NULL DEFAULT NULL,
  date DATE NULL DEFAULT NULL,
  shift VARCHAR(50) NULL DEFAULT NULL,
  time VARCHAR(50) NULL DEFAULT NULL, -- Đã sửa thành NULL cho an toàn nếu không nhập
  PRIMARY KEY (id),
  CONSTRAINT schedules_fk_doctor
    FOREIGN KEY (doctor_id)
    REFERENCES doctors (id)
    ON DELETE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


INSERT INTO users (username, password, role, full_name) VALUES ('admin', '123', 'admin', 'Quản Trị Viên');


INSERT INTO users (username, password, role, full_name) VALUES ('bs_Trường', '123', 'doctor', 'Dr. Nguyễn Đức Trường');
SET @last_user_id = LAST_INSERT_ID();
INSERT INTO doctors (user_id, specialty) VALUES (@last_user_id, 'Tim mạch');

INSERT INTO users (username, password, role, full_name) VALUES ('bs_Đức', '123', 'doctor', 'Dr. Nguyễn Minh Đức');
SET @last_user_id = LAST_INSERT_ID();
INSERT INTO doctors (user_id, specialty) VALUES (@last_user_id, 'Nhi khoa');

INSERT INTO users (username, password, role, full_name) VALUES ('bs_Đại', '123', 'doctor', 'Dr. Lê Đức Đại');
SET @last_user_id = LAST_INSERT_ID();
INSERT INTO doctors (user_id, specialty) VALUES (@last_user_id, 'Thần Kinh');

INSERT INTO users (username, password, role, full_name) VALUES ('bs_Bách', '123', 'doctor', 'Dr. Lê Xuân Bách');
SET @last_user_id = LAST_INSERT_ID();
INSERT INTO doctors (user_id, specialty) VALUES (@last_user_id, 'Da Liễu');

SET FOREIGN_KEY_CHECKS = 1;
