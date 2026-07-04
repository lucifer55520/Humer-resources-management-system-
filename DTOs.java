package com.hrms.dto;
import com.hrms.core.*;
import java.time.LocalDate;

public record SignupRequest(String employeeId, String email, String password, Role role) {}
public record SigninRequest(String email, String password) {}
public record LeaveSubmitRequest(LeaveType leaveType, LocalDate startDate, LocalDate endDate, String remarks) {}
public record LeaveApprovalRequest(LeaveStatus status, String adminComments) {}
