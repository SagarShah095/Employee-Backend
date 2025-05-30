const express = require("express");
const router = express.Router();
const {
  PunchPost,
  PunchOut,
  PunchGet,
  getTodayAttendanceSummary,
  getLatestPunchByEmpId,
  lunchStart,
  lunchEnd,
  getCurrentPunchState, // 👈 new
} = require("../controllers/EmpPunch");

router.post("/add", PunchPost);
router.post("/lunch-start", lunchStart);
router.post("/lunch-end", lunchEnd);
router.post("/out", PunchOut);
router.get("/", PunchGet);
router.get("/attendance-summary", getTodayAttendanceSummary);
router.get("/latest/:emp_id", getLatestPunchByEmpId);

// 🆕 New route to get punch state and times
router.get("/current-state/:emp_id", getCurrentPunchState);

module.exports = router;
