const express = require("express");
const {
  verifyUser,
  verifyUserFromEmployee,
} = require("../middleWare/authMiddleWare.js");
const { verify } = require("../controllers/authController");
const employeeAuth = require("../middleWare/employeeAuth.js");
const {
  addEmployee,
  getEmployees,
  getEmployee,
  updateEmployee,
  deleteEmployee,
  upload,
  empCount,
  changePassword,
  EmployeeLogin,
  empverify,
} = require("../controllers/AddEmpController");

const emprouter = express.Router();

emprouter.get("/", getEmployees);
emprouter.post("/add", upload.single("Img"), addEmployee);
emprouter.get("/count", empCount);
emprouter.get("/:id", getEmployee);
emprouter.put("/change-password/:id", changePassword);
emprouter.put("/:id", updateEmployee);
emprouter.delete("/:id", deleteEmployee);
emprouter.post("/EmpLogin", EmployeeLogin);
emprouter.get("/verify/:id", empverify);

module.exports = emprouter;
