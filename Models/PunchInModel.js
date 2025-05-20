const mongoose = require("mongoose");

const PunchSchema = new mongoose.Schema({
    emp_id: { type: String, required: true }, // ✅ correct 
    emp_name: { type: String, required: true },
    PunchIn: {
      type: String,
    //   enum: ["Sick", "Casual", "Annual"],
      required: true,
    },
    PunchOut: {
      type: String,
    //   enum: ["Sick", "Casual", "Annual"],
      required: true,
    },

  });
  

const Punch = mongoose.model("Punch", PunchSchema);

module.exports = Punch;
