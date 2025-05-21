const express = require("express");
const router = express.Router();
const {verifyUser} = require("../middleWare/authMiddleWare");
const {
  addLeave,
  getLeave,
  putLeave,
  getData,
} = require("../controllers/LeaveController");

const { PunchPost, PunchGet } = require("../controllers/EmpPunch")

router.get("/", PunchGet);
router.post("/add", PunchPost);
router.put("/:Id", putLeave);
router.get("/:Id", getData);
router.get("/latest/:emp_id", async (req, res) => {
  try {
    const latestPunch = await Punch.findOne({ emp_id: req.params.emp_id })
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, punch: latestPunch });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error getting punch", error });
  }
});

module.exports = router;