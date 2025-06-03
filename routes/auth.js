const express = require("express");
const { verifyUser } = require("../middleWare/authMiddleWare");
const {
  login,
  verify,
  changePassword,
  forgotPassword,
  resetPassword,
} = require("../controllers/authController");

const router = express.Router();

router.post("/login", login);
router.put("/change-password", changePassword);
router.get("/verify", verifyUser, verify);
router.post("/forgot-password",  forgotPassword);
router.post("/reset-password/:token",  resetPassword);

module.exports = router;
