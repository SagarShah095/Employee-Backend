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

module.exports = router;