const AddEmployee = require("../Models/AddEmp");
const multer = require("multer");
const path = require("path");
const User = require("../Models/User");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendMail = require("./utils/sendMail");

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
  const { currentPassword, newPassword } = req.body;
  const { id } = req.params;

  try {
    if (!currentPassword || !newPassword) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const user = await AddEmployee.findOne({ _id: id });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not linked to this employee" });
    }

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

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "Email is already registered in login system",
      });
    }

    const employeeExists = await AddEmployee.findOne({
      $or: [{ email }, { emp_id }],
    });
    if (employeeExists) {
      return res.status(400).json({
        success: false,
        message:
          employeeExists.email === email
            ? "Employee with this email already exists"
            : "Employee ID already in use",
      });
    }

    const hashPassword = await bcryptjs.hash(Pass, 10);

    const newUser = new User({
      name: emp_name,
      email,
      password: hashPassword,
      Role,
      profileImage: req.file ? req.file.filename : null,
    });
    await newUser.save();

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
      Pass: hashPassword,
      Role,
      Img: req.file ? req.file.filename : "",
    });
    await newEmp.save();

    newUser.employeeInfo = newEmp._id;
    await newUser.save();

    const loginUrl = `${process.env.FRONTEND_URL}`;
    await sendMail({
      to: email,
      subject: "Welcome to the Company!",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.5;">
          <h2>Welcome, ${emp_name}!</h2>
          <p>You have been successfully added to the employee system.</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Password:${Pass}</strong> (set by admin)</p>
          <p>
            You can log in here: <a href="https://employee-frontend-i28v.onrender.com/login" target="_blank" style="color: green;">Click to Login</a>
          </p>
          <br/>
          <p>Best regards,<br/>HR Team</p>
        </div>
      `,
    });

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
    console.error("Error in getEmployee:", error);
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
