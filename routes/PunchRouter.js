const express = require("express");
const router = express.Router();
const {
  PunchPost,
  PunchOut,
  PunchGet,
  getTodayAttendanceSummary,
  getLatestPunchByEmpId
} = require("../controllers/EmpPunch");

// POST - Punch In
router.post("/add", PunchPost);

// POST - Punch Out
router.post("/out", PunchOut);

// GET - All Punches
router.get("/", PunchGet);
// router.get("/status/:emp_id", getPunchStatu)

// GET - Attendance Summary
router.get("/attendance-summary", getTodayAttendanceSummary);

// GET - Latest punch for specific employee
router.get("/latest/:emp_id", getLatestPunchByEmpId);

module.exports = router;
