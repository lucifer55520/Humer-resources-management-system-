public enum Role {
    ADMIN, // Admin / HR Officer with management privileges[span_2](start_span)[span_2](end_span)
    EMPLOYEE // Regular user with limited access[span_3](start_span)[span_3](end_span)
}

public enum AttendanceStatus {
    PRESENT, ABSENT, HALF_DAY, LEAVE // Options for daily attendance tracking[span_4](start_span)[span_4](end_span)
}

public enum LeaveType {
    PAID, SICK, UNPAID // Options for leave types[span_5](start_span)[span_5](end_span)
}

public enum LeaveStatus {
    PENDING, APPROVED, REJECTED // Workflow statuses for leave requests[span_6](start_span)[span_6](end_span)
}
