const express = require("express");
const authMiddleWare = require("../middleWare/authMiddleWare.js");
const { login, verify } = require("../controllers/authController");

const router = express.Router();

router.post("/login", login);
router.get("/verify", authMiddleWare, verify);

module.exports = router;
