const mongoose = require("mongoose");

const AddEmployeSchema = new mongoose.Schema({
  emp_name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  emp_id: { type: String, required: true, unique: true },
  dob: { type: Date, required: true },
  Gen: {
    type: String,
    enum: ["Male", "Female", "Other"],
    required: true,
  },
  Mrd: {
    type: String,
    enum: ["Single", "Married"],
    required: true,
  },
  Des: { type: String, required: true },
  Dept: {
    type: String,
    enum: ["IT", "Database", "Metal", "Logistic"],
    required: true,
  },
  Salary: { type: String, required: true },
  Pass: { type: String, required: true },
  Role: {
    type: String,
    enum: ["Developer", "Designer", "HR"],
    required: true,
  },
  empRole: {
    type: String,
    enum: ["admin", "employee"],
    default: "employee",
  },
  employeeInfo: { type: mongoose.Schema.Types.ObjectId },
  Img: {
    type: String,
    required: true,
  },
  resetToken: String,
  resetTokenExpiry: Date,
});

module.exports = mongoose.model("AddEmployee", AddEmployeSchema);
