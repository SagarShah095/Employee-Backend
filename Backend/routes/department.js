const express = require("express");
const authMiddedleware = require("../middleWare/authMiddleWare");
const { addDepartment, getDepartments, getDepartment, updateDepartment, deleteDepartment } = require("../controllers/DepartmentController");

const router = express.Router();

router.get("/", authMiddedleware, getDepartments);
router.post("/add", authMiddedleware, addDepartment);
router.get("/:id", authMiddedleware, getDepartment);
router.put("/:id", authMiddedleware, updateDepartment);
router.delete("/:id", authMiddedleware, deleteDepartment);



module.exports = router;
