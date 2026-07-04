const express = require("express");
const fs = require("fs"); // File system module to read/write files
const app = express();

app.use(express.json());

const dataFile = "./employees.json";


const getEmployees = () => {
    const data = fs.readFileSync(dataFile, "utf8");
    return JSON.parse(data);
};

const saveEmployees = (data) => {
    fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
};



app.get("/api/employees", (req, res) => {
    const employees = getEmployees();
    res.json(employees);
});



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



app.post("/api/employees/signup", (req, res) => {
    const employees = getEmployees();
    const newEmployee = req.body; // Frontend থেকে আসা ডেটা
    
    
    newEmployee.id = "EMP" + Date.now(); 
    

    employees.push(newEmployee);
    
    
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
