const express = require("express");
const fs = require("fs"); // File system module to read/write files
const app = express();

app.use(express.json());

const dataFile = "./employees.json";

// Helper function: ফাইল থেকে ডেটা পড়ার জন্য
const getEmployees = () => {
    const data = fs.readFileSync(dataFile, "utf8");
    return JSON.parse(data);
};

// Helper function: ফাইলে নতুন ডেটা সেভ করার জন্য
const saveEmployees = (data) => {
    fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
};


// 1. GET: সব ইউজারের ইনফরমেশন দেখার জন্য
app.get("/api/employees", (req, res) => {
    const employees = getEmployees();
    res.json(employees);
});


// 2. GET: নির্দিষ্ট ইউজারের ইনফরমেশন দেখার জন্য
app.get("/api/employees/:id", (req, res) => {
    const employees = getEmployees();
    const searchId = req.params.id;
    
    const foundEmployee = employees.find(emp => emp.id === searchId);

    if (foundEmployee) {
        res.json(foundEmployee);
    } else {
        res.status(404).json({ message: "Employee not found" });
    }
});


// 3. POST: নতুন ইউজার তৈরি (Sign Up) করার জন্য
app.post("/api/employees/signup", (req, res) => {
    const employees = getEmployees();
    const newEmployee = req.body; // Frontend থেকে আসা ডেটা
    
    // নতুন ইউজারের একটি ইউনিক ID তৈরি করা (যেমন EMP170420...)
    newEmployee.id = "EMP" + Date.now(); 
    
    // নতুন ইউজারকে Array-তে যুক্ত করা
    employees.push(newEmployee);
    
    // আপডেট করা Array-টি ফাইলে সেভ করে দেওয়া
    saveEmployees(employees);

    res.status(201).json({ 
        message: "New user registered successfully!", 
        employee: newEmployee 
    });
});


const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
