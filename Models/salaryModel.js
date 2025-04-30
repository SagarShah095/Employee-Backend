const mongoose = require("mongoose");

const salarySchema = new mongoose.Schema({
  empId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "AddEmployee", // Employee reference (if you have an Employee model)
    required: true,
  },
  basicSalary: {
    type: Number,
    required: true,
  },
  allowances: {
    type: Number,
    required: true,
  },
  deductions: {
    type: Number,
    required: true,
  },
  totalSalary: {
    type: Number,
    required: true,
  },
  payDate: {
    type: Date,
    required: true,
  },
}, { timestamps: true });

const Salary = mongoose.model("Salary", salarySchema);

module.exports = Salary;
