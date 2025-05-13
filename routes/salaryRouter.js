const express = require("express");
const router = express.Router();
const salaryController = require("../controllers/salaryController");
const { verifyUser } = require("../middleWare/authMiddleWare");
const {
  addSalary,
  getSalaryByEmployee,
  SalaryAllData,
} = require("../controllers/salaryController");

router.post("/add", verifyUser, addSalary);

router.get("/employee/:empId", verifyUser, getSalaryByEmployee);

router.put("/update/:empId", verifyUser, salaryController.updateSalary);

router.delete("/delete/:empId", verifyUser, salaryController.deleteSalary);

router.get("/department/:deptName", verifyUser , salaryController.getEmployeesByDepartment);
router.get("/", salaryController.SalaryAllData);

module.exports = router;
