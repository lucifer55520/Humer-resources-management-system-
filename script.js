Script.js

// -----------------------------------------------------
// 1. Navigation & Tab Switching
// -----------------------------------------------------
function switchTab(tabId) {
    // Hide all tabs and show target
    document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');
    
    // Map Titles
    const titles = { 
        'dashboard': 'Dashboard Overview', 
        'profile': 'Employee Profile', 
        'attendance': 'Attendance Management', 
        'leave': 'Leave & Time-Off',
        'payroll': 'Payroll & Salary'
    };
    document.getElementById('page-title').innerText = titles[tabId];

    // Update Sidebar Active States
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('bg-blue-600', 'text-white');
        btn.classList.add('text-slate-300');
    });
    const activeBtn = document.querySelector(`.nav-btn[data-tab="${tabId}"]`);
    if (activeBtn) {
        activeBtn.classList.remove('text-slate-300');
        activeBtn.classList.add('bg-blue-600', 'text-white');
    }
}

// -----------------------------------------------------
// 2. Real-Time Clock (Attendance Tab)
// -----------------------------------------------------
setInterval(() => {
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const clockEl = document.getElementById('current-time');
    if (clockEl) clockEl.innerText = timeString;
}, 1000);

// -----------------------------------------------------
// 3. Leave Management State & Logic
// -----------------------------------------------------
let leaveRequests = [
    { id: 1, type: 'Sick Leave', start: '2026-06-15', end: '2026-06-16', remarks: 'Fever', status: 'Approved' },
    { id: 2, type: 'Paid Leave', start: '2026-07-10', end: '2026-07-12', remarks: 'Family trip', status: 'Pending' }
];
let isAdminView = false;

function renderLeaves() {
    const tbody = document.getElementById('leaveTableBody');
    const emptyState = document.getElementById('empty-state');
    
    if (!tbody || !emptyState) return;
    
    tbody.innerHTML = '';
    
    if (leaveRequests.length === 0) {
        emptyState.classList.remove('hidden');
        return;
    }
    emptyState.classList.add('hidden');

    leaveRequests.forEach(req => {
        let statusColor = req.status === 'Approved' ? 'bg-green-100 text-green-700' : 
                          req.status === 'Rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700';
        
        let row = `<tr class="hover:bg-slate-50 transition-colors">
            <td class="py-4 px-6 font-medium text-slate-800">
                ${req.type} <br>
                <span class="text-xs text-slate-400 font-normal">${req.remarks}</span>
            </td>
            <td class="py-4 px-6">${req.start} <i class="fas fa-arrow-right mx-1 text-slate-300 text-xs"></i> ${req.end}</td>
            <td class="py-4 px-6"><span class="px-2 py-1 ${statusColor} rounded-md text-xs font-semibold">${req.status}</span></td>`;
        
        if (isAdminView) {
            row += `<td class="py-4 px-6">
                ${req.status === 'Pending' ? `
                    <button onclick="updateLeaveStatus(${req.id}, 'Approved')" class="text-green-600 hover:text-green-800 mr-3 transition-colors" title="Approve"><i class="fas fa-check-circle text-lg"></i></button>
                    <button onclick="updateLeaveStatus(${req.id}, 'Rejected')" class="text-red-600 hover:text-red-800 transition-colors" title="Reject"><i class="fas fa-times-circle text-lg"></i></button>
                ` : '<span class="text-slate-400 text-xs font-medium bg-slate-100 px-2 py-1 rounded">Processed</span>'}
            </td>`;
        }
        row += `</tr>`;
        tbody.innerHTML += row;
    });
}

function submitLeave() {
    const type = document.getElementById('leaveType').value;
    const start = document.getElementById('startDate').value;
    const end = document.getElementById('endDate').value;
    const remarks = document.getElementById('remarks').value || 'N/A';

    if (!start || !end) return alert("Please select both start and end dates.");

    leaveRequests.unshift({ id: Date.now(), type, start, end, remarks, status: 'Pending' });
    document.getElementById('leaveForm').reset();
    renderLeaves();
}

function updateLeaveStatus(id, newStatus) {
    const req = leaveRequests.find(r => r.id === id);
    if (req) req.status = newStatus;
    renderLeaves();
}

// -----------------------------------------------------
// 4. Role Toggle Logic (Admin vs Employee capabilities)
// -----------------------------------------------------
function toggleRole(role) {
    const empBtn = document.getElementById('btn-role-employee');
    const adminBtn = document.getElementById('btn-role-admin');
    
    if (!empBtn || !adminBtn) return;
    
    isAdminView = (role === 'admin');
    
    // Toggle Header Button Visuals
    if (isAdminView) {
        adminBtn.classList.add('bg-white', 'shadow-sm', 'text-slate-800');
        adminBtn.classList.remove('text-slate-500');
        empBtn.classList.remove('bg-white', 'shadow-sm', 'text-slate-800');
        empBtn.classList.add('text-slate-500');
        
        // Toggle Leave Module Elements
        document.getElementById('leave-form-container').classList.add('hidden');
        document.getElementById('leave-table-title').innerText = 'Employee Leave Requests (Admin Queue)';
        document.getElementById('admin-action-header').classList.remove('hidden');

        // Toggle Profile Elements
        document.getElementById('admin-edit-profile-btn').classList.remove('hidden');
        document.getElementById('emp-edit-profile-btn').innerText = 'Update Partial Details';

        // Toggle Payroll Elements
        document.getElementById('admin-update-salary-btn').classList.remove('hidden');

    } else {
        empBtn.classList.add('bg-white', 'shadow-sm', 'text-slate-800');
        empBtn.classList.remove('text-slate-500');
        adminBtn.classList.remove('bg-white', 'shadow-sm', 'text-slate-800');
        adminBtn.classList.add('text-slate-500');
        
        // Toggle Leave Module Elements
        document.getElementById('leave-form-container').classList.remove('hidden');
        document.getElementById('leave-table-title').innerText = 'My Leave History';
        document.getElementById('admin-action-header').classList.add('hidden');

        // Toggle Profile Elements
        document.getElementById('admin-edit-profile-btn').classList.add('hidden');
        document.getElementById('emp-edit-profile-btn').innerHTML = '<i class="fas fa-pen mr-2"></i>Update Details';

        // Toggle Payroll Elements
        document.getElementById('admin-update-salary-btn').classList.add('hidden');
    }
    renderLeaves(); // Re-render table based on view
}

// -----------------------------------------------------
// 5. Initialize Application
// -----------------------------------------------------
window.onload = () => {
    switchTab('dashboard'); // Start on Dashboard view
    renderLeaves();         // Populate initial leave data
};


Index.html

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Enterprise HRMS Workspace</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        body { font-family: 'Inter', sans-serif; background-color: #f8fafc; }
        .tab-content { display: none; animation: fadeIn 0.3s ease-in-out; }
        .tab-content.active { display: block; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .glass-panel { background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(10px); }
    </style>
</head>
<body class="text-slate-800 flex h-screen overflow-hidden">

    <aside class="w-64 bg-slate-900 text-white flex flex-col shadow-2xl z-20 transition-all duration-300">
        <div class="p-6 border-b border-slate-700 flex items-center gap-3">
            <div class="w-8 h-8 rounded bg-blue-500 flex items-center justify-center font-bold text-lg">H</div>
            <span class="text-xl font-bold tracking-wide">HRMS Pro</span>
        </div>
        
        <nav class="flex-1 p-4 space-y-2 mt-4">
            <button onclick="switchTab('dashboard')" class="nav-btn w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-all" data-tab="dashboard">
                <i class="fas fa-chart-line w-5"></i> Dashboard
            </button>
            <button onclick="switchTab('profile')" class="nav-btn w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-all" data-tab="profile">
                <i class="fas fa-user-circle w-5"></i> Employee Profile
            </button>
            <button onclick="switchTab('attendance')" class="nav-btn w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-all" data-tab="attendance">
                <i class="fas fa-clock w-5"></i> Attendance
            </button>
            <button onclick="switchTab('leave')" class="nav-btn w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-all" data-tab="leave">
                <i class="fas fa-calendar-alt w-5"></i> Leave Requests
            </button>
            <button onclick="switchTab('payroll')" class="nav-btn w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-all" data-tab="payroll">
                <i class="fas fa-money-check-alt w-5"></i> Payroll & Salary
            </button>
        </nav>
        
        <div class="p-4 border-t border-slate-700">
            <button class="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg text-red-400 hover:bg-red-500 hover:text-white transition-all">
                <i class="fas fa-sign-out-alt w-5"></i> Logout
            </button>
        </div>
    </aside>

    <main class="flex-1 flex flex-col h-screen overflow-y-auto relative">
        
        <header class="h-16 glass-panel border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10 shadow-sm">
            <h2 id="page-title" class="text-xl font-semibold text-slate-800">Overview</h2>
            <div class="flex items-center gap-6">
                <div class="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200">
                    <button id="btn-role-employee" onclick="toggleRole('employee')" class="px-4 py-1.5 rounded-md text-sm font-semibold transition-all bg-white shadow-sm text-slate-800">Employee</button>
                    <button id="btn-role-admin" onclick="toggleRole('admin')" class="px-4 py-1.5 rounded-md text-sm font-medium transition-all text-slate-500 hover:text-slate-800">Admin / HR</button>
                </div>
                <div class="w-px h-6 bg-slate-300"></div>
                <div class="flex items-center gap-3 cursor-pointer">
                    <div class="text-right hidden md:block">
                        <p class="text-sm font-semibold text-slate-800">Soumyadeep Mondal</p>
                        <p class="text-xs text-slate-500">Area Sales Manager</p>
                    </div>
                    <div class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold border border-blue-200 shadow-sm">SM</div>
                </div>
            </div>
        </header>

        <div class="p-8 max-w-7xl mx-auto w-full">

            <div id="dashboard" class="tab-content">
                <div class="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 text-white shadow-lg mb-8 flex justify-between items-center">
                    <div>
                        <h1 class="text-3xl font-bold mb-2">Welcome back, Soumyadeep 👋</h1>
                        <p class="text-blue-100">Manage your attendance, leave requests, and professional profile from one unified workspace.</p>
                    </div>
                    <div class="hidden lg:block text-5xl opacity-20"><i class="fas fa-briefcase"></i></div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div class="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex items-center gap-5">
                        <div class="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center text-green-600 text-2xl"><i class="fas fa-calendar-check"></i></div>
                        <div>
                            <p class="text-sm text-slate-500 font-medium">Monthly Attendance</p>
                            <h3 class="text-2xl font-bold text-slate-800">22 Days</h3>
                        </div>
                    </div>
                    <div class="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex items-center gap-5">
                        <div class="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-2xl"><i class="fas fa-plane-departure"></i></div>
                        <div>
                            <p class="text-sm text-slate-500 font-medium">Available Paid Leave</p>
                            <h3 class="text-2xl font-bold text-slate-800">10 Days</h3>
                        </div>
                    </div>
                    <div class="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex items-center gap-5">
                        <div class="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center text-red-600 text-2xl"><i class="fas fa-notes-medical"></i></div>
                        <div>
                            <p class="text-sm text-slate-500 font-medium">Sick Leave Remaining</p>
                            <h3 class="text-2xl font-bold text-slate-800">5 Days</h3>
                        </div>
                    </div>
                </div>
            </div>

            <div id="profile" class="tab-content">
                <div class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div class="h-32 bg-slate-800 relative">
                        <div class="absolute -bottom-12 left-8 w-24 h-24 rounded-full border-4 border-white bg-blue-100 flex items-center justify-center text-3xl font-bold text-blue-600 shadow-md">SM</div>
                        <button id="admin-edit-profile-btn" class="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg text-sm font-medium backdrop-blur-sm transition-colors hidden"><i class="fas fa-pen mr-2"></i>Edit Full Profile</button>
                    </div>
                    <div class="pt-16 pb-8 px-8 border-b border-slate-100 flex justify-between items-start">
                        <div>
                            <h2 class="text-2xl font-bold text-slate-800">Soumyadeep Mondal</h2>
                            <div class="flex items-center gap-4 mt-2 text-sm text-slate-500">
                                <span class="flex items-center gap-1"><i class="fas fa-id-badge text-blue-500"></i> EMP001</span>
                                <span class="flex items-center gap-1"><i class="fas fa-briefcase text-blue-500"></i> Area Sales Manager</span>
                                <span class="flex items-center gap-1"><i class="fas fa-building text-blue-500"></i> Arish Bio naturals PVT LTD</span>
                            </div>
                        </div>
                        <button id="emp-edit-profile-btn" class="text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-lg text-sm font-medium border border-blue-200 transition-colors"><i class="fas fa-pen mr-2"></i>Update Details</button>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
                        <div>
                            <h3 class="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2"><i class="fas fa-user text-blue-500"></i> Personal Details</h3>
                            <table class="w-full text-sm">
                                <tbody>
                                    <tr class="border-b border-slate-100"><td class="py-3 text-slate-500 font-medium">Email</td><td class="py-3 font-semibold text-slate-800">soumyadeep@example.com</td></tr>
                                    <tr class="border-b border-slate-100"><td class="py-3 text-slate-500 font-medium">Phone</td><td class="py-3 font-semibold text-slate-800">+91 9876543210</td></tr>
                                    <tr class="border-b border-slate-100"><td class="py-3 text-slate-500 font-medium">Region</td><td class="py-3 font-semibold text-slate-800">West Bengal (Hooghly, Behala, Dumdum, Dunlop)</td></tr>
                                </tbody>
                            </table>
                        </div>
                        <div>
                            <h3 class="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2"><i class="fas fa-graduation-cap text-blue-500"></i> Education</h3>
                            <table class="w-full text-sm mb-6">
                                <tbody>
                                    <tr class="border-b border-slate-100"><td class="py-3 text-slate-500 font-medium">Academics</td><td class="py-3 font-semibold text-slate-800">Advanced Networking and Cyber Security (ANCS)</td></tr>
                                    <tr class="border-b border-slate-100"><td class="py-3 text-slate-500 font-medium">Institution</td><td class="py-3 font-semibold text-slate-800">Swami Vivekanand University</td></tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            <div id="attendance" class="tab-content">
                <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div class="lg:col-span-1">
                        <div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 text-center">
                            <div class="text-6xl text-blue-500 mb-4"><i class="fas fa-stopwatch"></i></div>
                            <h3 class="text-xl font-bold text-slate-800 mb-1">Time Tracker</h3>
                            <p class="text-sm text-slate-500 mb-6" id="current-time">00:00:00</p>
                            <div class="flex gap-3">
                                <button class="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors shadow-md shadow-blue-500/30">Check In</button>
                                <button class="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 rounded-lg font-medium border border-slate-200 transition-colors">Check Out</button>
                            </div>
                        </div>
                    </div>
                    <div class="lg:col-span-2">
                        <div class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                            <div class="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                                <h3 class="font-semibold text-slate-800">My Attendance Logs</h3>
                                <button class="text-sm text-blue-600 hover:underline"><i class="fas fa-download mr-1"></i> Report</button>
                            </div>
                            <div class="overflow-x-auto">
                                <table class="w-full text-left text-sm">
                                    <thead class="bg-white border-b border-slate-100 text-slate-500">
                                        <tr>
                                            <th class="py-3 px-6 font-medium">Date</th>
                                            <th class="py-3 px-6 font-medium">Check In</th>
                                            <th class="py-3 px-6 font-medium">Check Out</th>
                                            <th class="py-3 px-6 font-medium">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody class="divide-y divide-slate-100 text-slate-700">
                                        <tr class="hover:bg-slate-50 transition-colors">
                                            <td class="py-4 px-6">July 04, 2026</td>
                                            <td class="py-4 px-6">09:00 AM</td>
                                            <td class="py-4 px-6">--:-- PM</td>
                                            <td class="py-4 px-6"><span class="px-2 py-1 bg-green-100 text-green-700 rounded-md text-xs font-semibold">Present</span></td>
                                        </tr>
                                        <tr class="hover:bg-slate-50 transition-colors">
                                            <td class="py-4 px-6">July 03, 2026</td>
                                            <td class="py-4 px-6">09:15 AM</td>
                                            <td class="py-4 px-6">06:00 PM</td>
                                            <td class="py-4 px-6"><span class="px-2 py-1 bg-green-100 text-green-700 rounded-md text-xs font-semibold">Present</span></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div id="leave" class="tab-content">
                <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div id="leave-form-container" class="lg:col-span-1 bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                        <h3 class="text-xl font-bold text-slate-800 mb-6">Apply for Leave</h3>
                        <form id="leaveForm" onsubmit="event.preventDefault(); submitLeave();" class="space-y-4">
                            <div>
                                <label class="block text-sm font-medium text-slate-700 mb-1">Leave Type</label>
                                <select id="leaveType" class="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none text-sm">
                                    <option value="Paid Leave">Paid Leave</option>
                                    <option value="Sick Leave">Sick Leave</option>
                                    <option value="Unpaid Leave">Unpaid Leave</option>
                                </select>
                            </div>
                            <div class="grid grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-sm font-medium text-slate-700 mb-1">Start Date</label>
                                    <input type="date" id="startDate" class="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none text-sm">
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-slate-700 mb-1">End Date</label>
                                    <input type="date" id="endDate" class="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none text-sm">
                                </div>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-slate-700 mb-1">Remarks</label>
                                <textarea id="remarks" rows="3" class="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none text-sm placeholder-slate-400" placeholder="Reason for leave..."></textarea>
                            </div>
                            <button type="submit" class="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-medium transition-colors shadow-md shadow-blue-500/30">Submit Request</button>
                        </form>
                    </div>

                    <div class="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
                        <div class="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                            <h3 class="font-semibold text-slate-800" id="leave-table-title">My Leave History</h3>
                        </div>
                        <div class="overflow-x-auto flex-1">
                            <table class="w-full text-left text-sm">
                                <thead class="bg-white border-b border-slate-100 text-slate-500">
                                    <tr>
                                        <th class="py-3 px-6 font-medium">Type</th>
                                        <th class="py-3 px-6 font-medium">Duration</th>
                                        <th class="py-3 px-6 font-medium">Status</th>
                                        <th id="admin-action-header" class="py-3 px-6 font-medium hidden">Action</th>
                                    </tr>
                                </thead>
                                <tbody id="leaveTableBody" class="divide-y divide-slate-100 text-slate-700">
                                    </tbody>
                            </table>
                            <div id="empty-state" class="p-8 text-center text-slate-400 hidden">
                                <i class="fas fa-inbox text-4xl mb-3 opacity-50"></i>
                                <p>No leave requests found.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div id="payroll" class="tab-content">
                <div class="flex justify-between items-center mb-6">
                    <h3 class="text-xl font-bold text-slate-800">Salary & Payroll Slips</h3>
                    <button id="admin-update-salary-btn" class="hidden bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-md shadow-blue-500/30"><i class="fas fa-cogs mr-2"></i>Update Salary Structure</button>
                </div>

                <div class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div class="overflow-x-auto">
                        <table class="w-full text-left text-sm">
                            <thead class="bg-slate-50 border-b border-slate-100 text-slate-500">
                                <tr>
                                    <th class="py-4 px-6 font-medium">Month</th>
                                    <th class="py-4 px-6 font-medium">Basic Salary</th>
                                    <th class="py-4 px-6 font-medium">Allowances</th>
                                    <th class="py-4 px-6 font-medium">Deductions</th>
                                    <th class="py-4 px-6 font-medium text-slate-800">Net Payable</th>
                                    <th class="py-4 px-6 font-medium">Action</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-slate-100 text-slate-700">
                                <tr class="hover:bg-slate-50 transition-colors">
                                    <td class="py-4 px-6 font-semibold">June 2026</td>
                                    <td class="py-4 px-6">₹30,000</td>
                                    <td class="py-4 px-6 text-green-600">+₹8,000</td>
                                    <td class="py-4 px-6 text-red-500">-₹2,000</td>
                                    <td class="py-4 px-6 font-bold text-slate-900">₹36,000</td>
                                    <td class="py-4 px-6">
                                        <button class="text-blue-600 hover:bg-blue-50 px-3 py-1 rounded border border-blue-200 transition-colors"><i class="fas fa-download mr-1"></i> Slip</button>
                                    </td>
                                </tr>
                                <tr class="hover:bg-slate-50 transition-colors">
                                    <td class="py-4 px-6 font-semibold">May 2026</td>
                                    <td class="py-4 px-6">₹30,000</td>
                                    <td class="py-4 px-6 text-green-600">+₹8,000</td>
                                    <td class="py-4 px-6 text-red-500">-₹2,000</td>
                                    <td class="py-4 px-6 font-bold text-slate-900">₹36,000</td>
                                    <td class="py-4 px-6">
                                        <button class="text-blue-600 hover:bg-blue-50 px-3 py-1 rounded border border-blue-200 transition-colors"><i class="fas fa-download mr-1"></i> Slip</button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

        </div>
    </main>

    <script src="script.js"></script>
</body>
</html>
