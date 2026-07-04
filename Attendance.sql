CREATE TABLE attendance (
    id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id INT NOT NULL,
    attendance_date DATE NOT NULL,
    check_in TIME,
    check_out TIME,
    status ENUM('Present','Absent','Half-day','Leave') DEFAULT 'Present'
);
