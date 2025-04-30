const express = require("express");
const authMiddleWare = require("../middleWare/authMiddleWare.js");
const {
  addEmployee,
  getEmployees,
  getEmployee,
  updateEmployee,
  deleteEmployee,
  upload,
} = require("../controllers/AddEmpController");

const emprouter = express.Router();

emprouter.get("/", authMiddleWare, getEmployees);
emprouter.post("/add", upload.single("Img"), authMiddleWare, addEmployee);
emprouter.get("/:id", authMiddleWare, getEmployee);
emprouter.put("/:id", authMiddleWare, updateEmployee);
emprouter.delete("/:id", authMiddleWare, deleteEmployee);

module.exports = emprouter;
