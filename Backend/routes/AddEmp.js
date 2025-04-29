const express = require("express");
const verifyUser = require("../middleWare/authMiddleWare.js");
const {
  addEmployee,
  getEmployees,
  getEmployee,
  updateEmployee,
  deleteEmployee,
  upload,
} = require("../controllers/AddEmpController");

const emprouter = express.Router();

emprouter.get("/", verifyUser, getEmployees);
emprouter.post("/add", upload.single("Img"), verifyUser, addEmployee);
emprouter.get("/:id", verifyUser, getEmployee);
emprouter.put("/:id", verifyUser, updateEmployee);
emprouter.delete("/:id", verifyUser, deleteEmployee);

module.exports = emprouter;
