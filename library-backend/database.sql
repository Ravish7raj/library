-- Create the library database if it doesn't exist
CREATE DATABASE IF NOT EXISTS library;

-- Use the library database
USE library;

-- Drop the table if it exists to ensure clean schema
DROP TABLE IF EXISTS bookings;

-- Create the bookings table with updated schema
CREATE TABLE bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_name VARCHAR(100) NOT NULL,
    mobile_number VARCHAR(15) NOT NULL,
    dob DATE NOT NULL,
    time_slots JSON NOT NULL,
    seat_number INT NOT NULL,
    facility_type ENUM('AC', 'NON-AC') NOT NULL,
    months INT NOT NULL,
    from_date DATE NOT NULL,
    to_date DATE NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_mobile (mobile_number),
    INDEX idx_seat (seat_number),
    INDEX idx_dates (from_date, to_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4; 