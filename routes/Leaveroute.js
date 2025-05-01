const express = require("express");
const router = express.Router();
const authMiddleWare = require("../middleWare/authMiddleWare");
const {
  addLeave,
  getLeave,
  putLeave,
  getData,
} = require("../controllers/LeaveController");

router.get("/", authMiddleWare, getLeave);
router.post("/add", authMiddleWare, addLeave);
router.put("/:Id", authMiddleWare, putLeave);
router.get("/:Id", authMiddleWare, getData);

module.exports = router;
    