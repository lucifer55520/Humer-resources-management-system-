import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
public class User {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(unique = true, nullable = false)
    private String employeeId; // Users can register using Employee ID[span_7](start_span)[span_7](end_span)
    
    @Column(unique = true, nullable = false)
    private String email; // Registration and login requires email[span_8](start_span)[span_8](end_span)
    
    @Column(nullable = false)
    private String password;
    
    @Enumerated(EnumType.STRING)
    private Role role; // Role-based access (Admin vs Employee)[span_9](start_span)[span_9](end_span)

    // Getters and Setters omitted for brevity
    public Long getId() { return id; }
    public String getPassword() { return password; }
    public Role getRole() { return role; }
}

@Entity
@Table(name = "profiles")
public class Profile {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long userId;
    
    private String phone;
    private String address;
    private String profilePictureUrl;
    
    private String jobDetails;
    private String salaryStructure;

    // Getters and Setters omitted for brevity
}

@Entity
@Table(name = "attendances")
public class Attendance {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long userId;
    
    private LocalDate date = LocalDate.now();
    private LocalDateTime checkIn;
    private LocalDateTime checkOut;
    
    @Enumerated(EnumType.STRING)
    private AttendanceStatus status = AttendanceStatus.PRESENT; // Default status is Present[span_10](start_span)[span_10](end_span)

    // Getters and Setters omitted for brevity
}

@Entity
@Table(name = "leave_requests")
public class LeaveRequest {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long userId;
    
    @Enumerated(EnumType.STRING)
    private LeaveType leaveType;
    
    private LocalDate startDate;
    private LocalDate endDate;
    private String remarks; // Employee can add remarks[span_11](start_span)[span_11](end_span)
    
    @Enumerated(EnumType.STRING)
    private LeaveStatus status = LeaveStatus.PENDING; // Leave request status defaults to Pending[span_12](start_span)[span_12](end_span)
    
    private String adminComments; // Admin can add comments[span_13](start_span)[span_13](end_span)

    // Getters and Setters omitted for brevity
    public void setStatus(LeaveStatus status) { this.status = status; }
    public void setAdminComments(String comments) { this.adminComments = comments; }
}

@Entity
@Table(name = "payrolls")
public class Payroll {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long userId;
    private String month;
    private Double netSalary;

    // Getters and Setters omitted for brevity
}
