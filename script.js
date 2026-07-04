
function switchTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
    
    const targetTab = document.getElementById(tabId);
    if(targetTab) targetTab.classList.add('active');
    
    const titles = { 
        'dashboard': 'Dashboard Overview', 
        'profile': 'Employee Profile', 
        'attendance': 'Attendance Management', 
        'leave': 'Leave & Time-Off',
        'payroll': 'Payroll & Salary'
    };
    
    const titleEl = document.getElementById('page-title');
    if(titleEl) titleEl.innerText = titles[tabId] || 'Overview';

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
// 2. Real-Time Clock
// -----------------------------------------------------
setInterval(() => {
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const clockEl = document.getElementById('current-time');
    if (clockEl) clockEl.innerText = timeString;
}, 1000);

// -----------------------------------------------------
// 3. Leave Management State
// -----------------------------------------------------
let leaveRequests = [
    { id: 1, type: 'Sick Leave', start: '2026-06-15', end: '2026-06-16', remarks: 'Fever', status: 'Approved' }
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
            <td class="py-4 px-6 font-medium text-slate-800">${req.type}</td>
            <td class="py-4 px-6">${req.start} <i class="fas fa-arrow-right mx-1 text-slate-300 text-xs"></i> ${req.end}</td>
            <td class="py-4 px-6"><span class="px-2 py-1 ${statusColor} rounded-md text-xs font-semibold">${req.status}</span></td>`;
        
        if (isAdminView) {
            row += `<td class="py-4 px-6">
                ${req.status === 'Pending' ? `
                    <button onclick="updateLeaveStatus(${req.id}, 'Approved')" class="text-green-600 mr-3"><i class="fas fa-check-circle"></i></button>
                    <button onclick="updateLeaveStatus(${req.id}, 'Rejected')" class="text-red-600"><i class="fas fa-times-circle"></i></button>
                ` : '<span class="text-slate-400 text-xs font-medium">Processed</span>'}
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

    if (!start || !end) return alert("Please select dates.");
    if (new Date(end) < new Date(start)) return alert("End date cannot be before start date.");

    leaveRequests.unshift({ id: Date.now(), type, start, end, remarks: 'N/A', status: 'Pending' });

    const form = document.getElementById('leaveForm');
    if (form) form.reset();

    renderLeaves();
}

function updateLeaveStatus(id, newStatus) {
    const req = leaveRequests.find(r => r.id === id);
    if (req) req.status = newStatus;
    renderLeaves();
}

// -----------------------------------------------------
// 4. Role Toggle
// -----------------------------------------------------
function toggleRole(role) {
    const empBtn = document.getElementById('btn-role-employee');
    const adminBtn = document.getElementById('btn-role-admin');
    
    if (!empBtn || !adminBtn) return;
    isAdminView = (role === 'admin');
    
    if (isAdminView) {
        adminBtn.classList.add('bg-white', 'shadow-sm', 'text-slate-800');
        adminBtn.classList.remove('text-slate-500');
        empBtn.classList.remove('bg-white', 'shadow-sm', 'text-slate-800');
        empBtn.classList.add('text-slate-500');
        
        document.getElementById('leave-form-container').classList.add('hidden');
        document.getElementById('admin-action-header').classList.remove('hidden');
        document.getElementById('admin-update-salary-btn').classList.remove('hidden');
    } else {
        empBtn.classList.add('bg-white', 'shadow-sm', 'text-slate-800');
        empBtn.classList.remove('text-slate-500');
        adminBtn.classList.remove('bg-white', 'shadow-sm', 'text-slate-800');
        adminBtn.classList.add('text-slate-500');
        
        document.getElementById('leave-form-container').classList.remove('hidden');
        document.getElementById('admin-action-header').classList.add('hidden');
        document.getElementById('admin-update-salary-btn').classList.add('hidden');
    }
    renderLeaves(); 
}

// -----------------------------------------------------
// 5. Initialize Application & Dynamic User (SOLUTION FOR BLANK PAGE)
// -----------------------------------------------------
window.onload = () => {
    // 1. Get User Data from Login
    const userName = localStorage.getItem('loggedInUser') || 'Guest User';
    const userRole = localStorage.getItem('loggedInRole') || 'Employee';

    // 2. Set Names in the UI
    const nameEl = document.getElementById('top-nav-name');
    const roleEl = document.getElementById('top-nav-role');
    const initialEl = document.getElementById('top-nav-initial');
    const dashWelcomeEl = document.getElementById('dash-welcome-name');
    const profileFullNameEl = document.getElementById('profile-full-name');
    const profileLargeInitEl = document.getElementById('profile-large-initial');

    if(nameEl) nameEl.innerText = userName;
    if(roleEl) roleEl.innerText = userRole;
    if(dashWelcomeEl) dashWelcomeEl.innerText = userName;
    if(profileFullNameEl) profileFullNameEl.innerText = userName;
    
    // Set the Initial Letters (e.g. "S" for Soumyadeep)
    if(initialEl && userName) initialEl.innerText = userName.charAt(0).toUpperCase();
    if(profileLargeInitEl && userName) profileLargeInitEl.innerText = userName.charAt(0).toUpperCase();

    // 3. Open the Dashboard Tab automatically so it's not blank
    switchTab('dashboard');

    // 4. Sync the Employee/Admin toggle with the role chosen at sign-up.
    // Auth.html stores 'Employee' or 'Admin' (capitalized); toggleRole()
    // expects lowercase 'employee'/'admin', so normalize before comparing.
    toggleRole(userRole.toLowerCase() === 'admin' ? 'admin' : 'employee');
};
