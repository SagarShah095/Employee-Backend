const express = require("express");
const {verifyUser} = require("../middleWare/authMiddleWare.js");
const { addDepartment, getDepartments, getDepartment, updateDepartment, deleteDepartment } = require("../controllers/DepartmentController");

const router = express.Router();

router.get("/", verifyUser, getDepartments);
router.post("/add", verifyUser, addDepartment);
router.get("/:id", verifyUser, getDepartment);
router.put("/:id", verifyUser, updateDepartment);
router.delete("/:id", verifyUser, deleteDepartment);



module.exports = router;
