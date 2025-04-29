const express = require("express");
const router = express.Router();
const salaryController = require("../controllers/salaryController");

router.post("/add", salaryController.addSalary);



router.get("/employee/:empId", salaryController.getSalaryByEmployee);

// FIX: Correct the function name here
router.put("/update/:empId", salaryController.updateSalary);

router.delete("/delete/:empId", salaryController.deleteSalary);

router.get("/department/:deptName", salaryController.getEmployeesByDepartment);

module.exports = router;
