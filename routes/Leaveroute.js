const express = require("express");
const router = express.Router();
const {verifyUser} = require("../middleWare/authMiddleWare");
const {
  addLeave,
  getLeave,
  putLeave,
  getData,
} = require("../controllers/LeaveController");

router.get("/", getLeave);
router.post("/add", addLeave);
router.put("/:Id", putLeave);
router.get("/:Id", getData);

module.exports = router;