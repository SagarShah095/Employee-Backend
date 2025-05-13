const User = require("../Models/User");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Salary = require("../Models/salaryModel");

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log(user, "user in login controller");
    const isMatch = await bcryptjs.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign(
      { _id: user._id, role: user.role },
      "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
      { expiresIn: "20d" }
    );

    res.status(200).json({
      success: true,
      token,
      user: {
        _id: user.id,
        name: user.name,
        role: user.role,
        profileImage: user.profileImage,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

const changePassword = async (req, res) => {
  const { empId, currentPassword, newPassword } = req.body;

  try {
    const user = await User.findById(empId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Employee not found" });
    }
    console.log(user, "user in change password");

    const isMatch = await bcryptjs.compare(currentPassword, user.Pass);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Current password is incorrect" });
    }

    // 🔐 Hash the new password before saving
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(newPassword, salt);

    user.password = hashedPassword;
    await user.save();
    console.log(user, "user in after change password");

    return res
      .status(200)
      .json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    console.error("Password change error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

const verify = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: "Token is valid",
      user: req.user,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};



module.exports = {
  login,
  verify,
  changePassword,
};
