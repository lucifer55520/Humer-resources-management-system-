// javascript.js

const express = require("express");
const app = express();

app.use(express.json());

// Sample Employee Data
let employee = {
    id: "EMP001",
    name: "John Doe",
    email: "john@example.com",

    personalDetails: {
        phone: "9876543210",
        address: "New Delhi, India"
    },

    jobDetails: {
        department: "IT",
        designation: "Software Developer",
        joiningDate: "01-Jan-2025"
    },

    salaryStructure: {
        basic: 40000,
        hra: 8000,
        allowance:
