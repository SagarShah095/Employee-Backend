// routes/punchRoutes.js
const express = require("express");
const router = express.Router();
const Punch = require("../Models/PunchInModel")
const {
  PunchPost,
  PunchOut,
  PunchGet,
  getTodayAttendanceSummary,
} = require("../controllers/EmpPunch");

router.post("/add", PunchPost);          // Punch In
router.post("/out", PunchOut);           // Punch Out
router.get("/", PunchGet);               // All punches
router.get("/attendance-summary", getTodayAttendanceSummary);

router.get("/latest/:emp_id", async (req, res) => {
  try {
    const latestPunch = await Punch.findOne({ emp_id: req.params.emp_id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, punch: latestPunch });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error getting punch", error });
  }
});

module.exports = router;
