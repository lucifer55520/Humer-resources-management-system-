// Store leave requests
let leaveRequests = [];

// Employee submits leave
function submitLeave() {

    const leaveType = document.getElementById("leaveType").value;
    const startDate = document.getElementById("startDate").value;
    const endDate = document.getElementById("endDate").value;
    const remarks = document.getElementById("remarks").value;

    if (startDate === "" || endDate === "") {
        alert("Please select start and end dates.");
        return;
    }

    const request = {
        id: Date.now(),
        leaveType,
        startDate,
        endDate,
        remarks,
        status: "Pending",
        comment: ""
    };

    leaveRequests.push(request);

    alert("Leave request submitted successfully.");

    document.getElementById("leaveForm").reset();

    loadEmployeeLeaves();
    loadAdminRequests();
}

// Employee View
function loadEmployeeLeaves() {

    const table = document.getElementById("employeeLeaveTable");

    if (!table) return;

    table.innerHTML = "";

    leaveRequests.forEach(request => {

        table.innerHTML += `
        <tr>
            <td>${request.leaveType}</td>
            <td>${request.startDate}</td>
            <td>${request.endDate}</td>
            <td>${request.status}</td>
        </tr>
        `;
    });

}

// Admin View
function loadAdminRequests() {

    const table = document.getElementById("adminLeaveTable");

    if (!table) return;

    table.innerHTML = "";

    leaveRequests.forEach(request => {

        table.innerHTML += `
        <tr>
            <td>${request.leaveType}</td>
            <td>${request.startDate}</td>
            <td>${request.endDate}</td>
            <td>${request.remarks}</td>
            <td>${request.status}</td>
            <td>
                <button class="btn btn-success btn-sm"
                onclick="approveLeave(${request.id})">
                Approve
                </button>

                <button class="btn btn-danger btn-sm"
                onclick="rejectLeave(${request.id})">
                Reject
                </button>
            </td>
        </tr>
        `;
    });

}

// Approve Leave
function approveLeave(id) {

    leaveRequests.forEach(request => {

        if (request.id === id) {
            request.status = "Approved";
        }

    });

    loadEmployeeLeaves();
    loadAdminRequests();
}

// Reject Leave
function rejectLeave(id) {

    leaveRequests.forEach(request => {

        if (request.id === id) {
            request.status = "Rejected";
        }

    });

    loadEmployeeLeaves();
    loadAdminRequests();
}
