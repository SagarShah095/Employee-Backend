const mongoose = require("mongoose");

const punchSchema = new mongoose.Schema(
  {
    emp_id: { type: String, required: true },
    emp_name: { type: String, required: true },
    PunchIn: { type: Date, required: true },
    PunchOut: { type: Date, default: null },
    LunchStart: { type: Date, default: null },
    LunchEnd: { type: Date, default: null },
    status: { type: String, default: "Present" },
    lockUntil: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Punch", punchSchema);
