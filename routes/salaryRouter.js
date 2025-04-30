const express = require("express");
const router = express.Router();
const salaryController = require("../controllers/salaryController");
const authMiddleWare = require("../middleware/authMiddleware");
const { addSalary, getSalaryByEmployee } = require("../controllers/salaryController");

router.post("/add", authMiddleWare, addSalary);

router.get(
  "/employee/:empId",authMiddleWare, 
  getSalaryByEmployee
);

router.put("/update/:empId", authMiddleWare, salaryController.updateSalary);

router.delete("/delete/:empId", authMiddleWare, salaryController.deleteSalary);

router.get(
  "/department/:deptName",
  authMiddleWare,
  salaryController.getEmployeesByDepartment
);

module.exports = router;
