// auth.js

document.addEventListener('DOMContentLoaded', () => {
    
    // UI Elements
    const btnLoginTab = document.getElementById('btn-tab-login');
    const btnSignupTab = document.getElementById('btn-tab-signup');
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');

    // -----------------------------------------------------
    // 1. Tab Switching Logic (Sign In এবং Sign Up এর মধ্যে টগল করা)
    // -----------------------------------------------------
    function switchTab(mode) {
        if (mode === 'login') {
            loginForm.classList.remove('hidden');
            loginForm.classList.add('block');
            signupForm.classList.remove('block');
            signupForm.classList.add('hidden');
            
            btnLoginTab.classList.add('bg-white', 'shadow-sm', 'text-slate-800');
            btnLoginTab.classList.remove('text-slate-500');
            btnSignupTab.classList.add('text-slate-500');
            btnSignupTab.classList.remove('bg-white', 'shadow-sm', 'text-slate-800');
        } else {
            signupForm.classList.remove('hidden');
            signupForm.classList.add('block');
            loginForm.classList.remove('block');
            loginForm.classList.add('hidden');
            
            btnSignupTab.classList.add('bg-white', 'shadow-sm', 'text-slate-800');
            btnSignupTab.classList.remove('text-slate-500');
            btnLoginTab.classList.add('text-slate-500');
            btnLoginTab.classList.remove('bg-white', 'shadow-sm', 'text-slate-800');
        }
    }

    if (btnLoginTab && btnSignupTab) {
        btnLoginTab.addEventListener('click', () => switchTab('login'));
        btnSignupTab.addEventListener('click', () => switchTab('signup'));
    }

    // -----------------------------------------------------
    // 2. Login Logic
    // -----------------------------------------------------
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault(); // ফর্মের ডিফল্ট রিলোড বন্ধ করা

            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;

            if (!email || !password) {
                alert("Please enter both email and password.");
                return;
            }

            // --- FUTURE API CONNECTION (আপনার Node.js সার্ভারের সাথে যুক্ত করার জন্য) ---
            /*
            try {
                const response = await fetch('http://localhost:3000/api/employees/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });
                
                const data = await response.json();
                
                if (response.ok) {
                    // ডেটাবেস থেকে পাওয়া আসল নাম লোকাল স্টোরেজে সেভ করা
                    localStorage.setItem('loggedInUser', data.employee.name);
                    localStorage.setItem('loggedInRole', data.employee.role || 'Employee');
                    localStorage.setItem('loggedInEmail', data.employee.email);
                    window.location.href = 'index.html';
                } else {
                    alert("Error: " + data.message);
                }
            } catch (error) {
                console.error("Login failed:", error);
                alert("Server error. Please try again later.");
            }
            */

            // --- PROTOTYPE MODE: সরাসরি ড্যাশবোর্ডে রিডাইরেক্ট করা হচ্ছে ---
            const namePart = email.split('@')[0];
            const formattedName = namePart.charAt(0).toUpperCase() + namePart.slice(1);
            
            localStorage.setItem('loggedInUser', formattedName);
            localStorage.setItem('loggedInEmail', email);
            localStorage.setItem('loggedInRole', 'Employee');
            
            console.log("Logging in with:", email);
            window.location.href = 'index.html'; 
        });
    }

    // -----------------------------------------------------
    // 3. Sign Up Logic (নতুন ইউজার রেজিস্ট্রেশন)
    // -----------------------------------------------------
    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const name = document.getElementById('signup-name').value;
            const empId = document.getElementById('signup-empid')?.value;
            const email = document.getElementById('signup-email').value;
            const password = document.getElementById('signup-password').value;
            const role = document.getElementById('signup-role')?.value || 'Employee';

            if (!name || !empId || !email || !password) {
                alert("Please fill all fields.");
                return;
            }
            if (password.length < 8) {
                alert("Password must be at least 8 characters long.");
                return;
            }

            // --- FUTURE API CONNECTION (আপনার Node.js সার্ভারের সাথে যুক্ত করার জন্য) ---
            /*
            try {
                const response = await fetch('http://localhost:3000/api/employees/signup', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, empId, email, password, role: role.toUpperCase() })
                });
                
                const data = await response.json();
                
                if (response.ok) {
                    localStorage.setItem('loggedInUser', name);
                    localStorage.setItem('loggedInRole', role);
                    localStorage.setItem('loggedInEmail', email);
                    alert("Registration successful!");
                    window.location.href = 'index.html';
                } else {
                    alert("Error: " + data.message);
                }
            } catch (error) {
                console.error("Signup failed:", error);
                alert("Server error. Please try again later.");
            }
            */

            // --- PROTOTYPE MODE: সরাসরি ড্যাশবোর্ডে রিডাইরেক্ট করা হচ্ছে ---
            localStorage.setItem('loggedInUser', name);
            localStorage.setItem('loggedInEmpId', empId);
            localStorage.setItem('loggedInEmail', email);
            localStorage.setItem('loggedInRole', role);
            
            alert(`Registration successful for ${name}! Redirecting to workspace...`);
            console.log("New User Registered:", name, email);
            
            window.location.href = 'index.html'; 
        });
    }
});
