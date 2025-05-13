const AddEmployee = require("../Models/AddEmp");
const multer = require("multer");
const path = require("path");
const User = require("../Models/User");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

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

const changePassword = async (req, res) => {
  const {currentPassword, newPassword } = req.body;
  const { id } = req.params;

  try {
    if ( !currentPassword || !newPassword) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    console.log("EmpID Received:", id);

    const user = await AddEmployee.findOne({_id: id});

    console.log("User found:", user);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not linked to this employee" });
    }

    console.log("User found:", user);

    const isMatch = await bcryptjs.compare(currentPassword, user.Pass);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Current password is incorrect" });
    }

    const hashedPassword = await bcryptjs.hash(newPassword, 10);
    user.Pass = hashedPassword;
    await user.save();

    return res
      .status(200)
      .json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    console.error("Change Password Error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
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
    const hashPassword = await bcryptjs.hash(Pass, 10);

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
    newUser.employeeInfo = newEmp._id;
    await newUser.save();

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
    const emp = await AddEmployee.findById(id);
    return res.status(200).json({
      success: true,
      emp,
    });
  } catch (error) {
    console.error("Error in getEmployee:", error); // helpful for debugging
    return res.status(500).json({
      success: false,
      message: "Get Employee server error",
      error: error.message,
    });
  }
};

const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const updateEmp = await AddEmployee.findByIdAndUpdate(
      id,
      { ...req.body },
      { new: true } // returns the updated document
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

const empCount = async (req, res) => {
  try {
    const total = await AddEmployee.countDocuments({});
    res.status(200).json({ success: true, count: total });
  } catch (error) {
    console.error("Error counting employees:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const EmployeeLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await AddEmployee.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    const isMatch = await bcryptjs.compare(password, user.Pass);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }
    const token = jwt.sign(
      { _id: user._id, role: user.empRole },
      "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
      { expiresIn: "20d" }
    );
    res.status(200).json({
      success: true,
      token,
      user: {
        _id: user.id,
        name: user.name,
        role: user.empRole,
        profileImage: user.profileImage,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

const empverify = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("ID:", id);
    const employee = await AddEmployee.findById(id);
    if (!employee) {
      return res
        .status(404)
        .json({ success: false, message: "Employee not found" });
    }

    res.json({ success: true, user: employee });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = {
  getEmployees,
  addEmployee,
  getEmployee,
  updateEmployee,
  deleteEmployee,
  empCount,
  upload,
  changePassword,
  EmployeeLogin,
  empverify,
};
