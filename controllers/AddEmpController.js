const AddEmployee = require("../Models/AddEmp");
const multer = require("multer");
const path = require("path");
const User = require("../Models/User");
const bcrypt = require("bcrypt");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

const getEmployees = async (req, res) => {
  try {
    console.log("Get Employees");
    const Emp = await AddEmployee.find();
    return res.status(200).json({ success: true, Emp });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Get Employee server error",
    });
  }
};

const addEmployee = async (req, res) => {
  try {
    const {
      emp_name,
      email,
      emp_id,
      dob,
      Gen,
      Mrd,
      Des,
      Dept,
      Salary,
      Pass,
      Role,
    } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // Password Hash
    const hashPassword = await bcrypt.hash(Pass, 10);

    // Create new user for login system
    const newUser = new User({
      name: emp_name,
      email,
      password: hashPassword,
      Role,
      profileImage: req.file ? req.file.filename : null,
    });

    await newUser.save();

    // Create new employee entry
    const newEmp = new AddEmployee({
      emp_name,
      email,
      emp_id,
      dob,
      Gen,
      Mrd,
      Des,
      Dept,
      Salary,
      Pass: hashPassword, // save hashed password
      Role,
      Img: req.file ? req.file.filename : "",
    });

    await newEmp.save();

    return res.status(201).json({
      success: true,
      message: "Employee added successfully",
      data: newEmp,
    });
  } catch (error) {
    console.error("Error adding employee:", error);
    return res.status(500).json({
      success: false,
      message: "Add Employee server error",
      error: error.message,
    });
  }
};

const getEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const emp = await AddEmployee.findById({ _id: id });
    return res.status(200).json({
      success: true,
      emp,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Get Employee server error",
    });
  }
};

const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const { emp_name, Mrd, Des, Dept, Salary } = req.body;
    const updateEmp = await AddEmployee.findByIdAndUpdate(
      { _id: id },
      { ...req.body }
    );
    return res.status(200).json({
      success: true,
      data: updateEmp,
    });
  } catch (error) {
    console.error("Error updating employee:", error);
    res.status(500).json({
      success: false,
      message: "Update Employee server error",
    });
  }
};

const deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    await AddEmployee.findByIdAndDelete({ _id: id });
    return res.status(200).json({
      success: true,
      message: "Employee deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Delete Employee server error",
    });
  }
};

module.exports = {
  getEmployees,
  addEmployee,
  getEmployee,
  updateEmployee,
  deleteEmployee,
  upload,
};
