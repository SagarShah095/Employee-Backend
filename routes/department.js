const express = require("express");
const authMiddedleWare = require("../middleWare/authMiddleWare");
const { addDepartment, getDepartments, getDepartment, updateDepartment, deleteDepartment } = require("../controllers/DepartmentController");

const router = express.Router();

router.get("/", authMiddedleWare, getDepartments);
router.post("/add", authMiddedleWare, addDepartment);
router.get("/:id", authMiddedleWare, getDepartment);
router.put("/:id", authMiddedleWare, updateDepartment);
router.delete("/:id", authMiddedleWare, deleteDepartment);



module.exports = router;
