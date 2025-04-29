const express = require("express");
const verifyUser = require("../middleWare/authMiddleWare.js");
const { login, verify } = require("../controllers/authController");

const router = express.Router();

router.post("/login", login);
router.get("/verify", verifyUser, verify);

module.exports = router;
