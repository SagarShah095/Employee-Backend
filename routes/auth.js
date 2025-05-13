const express = require("express");
const {verifyUser} = require("../middleWare/authMiddleWare");
const { login, verify, changePassword } = require("../controllers/authController");

const router = express.Router();

router.post("/login", login);
router.put("/change-password", changePassword);
router.get("/verify", verifyUser, verify);

module.exports = router;