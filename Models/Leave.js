const mongoose = require("mongoose");

const LeaveSchema = new mongoose.Schema({
  emp_id: { type: String, required: true }, // ✅ correct
  emp_name: { type: String, required: true },
  leavetype: {
    type: String,
    enum: ["Sick", "Casual", "Annual"],
    required: true,
  },
  desc: { type: String, required: true },
  fromDate: { type: Date, required: true },
  toDate: { type: Date, required: true },
  status: {
    type: String,
    enum: ["Pending", "Approved", "Rejected"],
    default: "Pending",
  },
});

const Leave = mongoose.model("Leave", LeaveSchema);

module.exports = Leave;
