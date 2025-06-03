const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["admin", "employee"],
    required: true,
    default: "employee",
  },
  salary: { type: mongoose.Schema.Types.ObjectId, ref: "Salary" },
  profileImage: { type: String },
  employeeInfo: { type: mongoose.Schema.Types.ObjectId, ref: "AddEmployee" },
  createAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
   resetToken: String,
  resetTokenExpiry: Date,
});

module.exports = mongoose.model("User", UserSchema);
