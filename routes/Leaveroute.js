const express = require("express");
const router = express.Router();
const {verifyUser} = require("../middleWare/authMiddleWare");
const {PunchPost} = require("../controllers/EmpPunch")

// router.get("/", getLeave);
router.post("/add", PunchPost);
// router.put("/:Id", putLeave);
// router.get("/:Id", getData);

module.exports = router;