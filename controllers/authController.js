const User = require("../Models/User");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

const AddEmployee = require("../Models/AddEmp");
const bcrypt = require("bcryptjs");

const crypto = require("crypto");
const nodemailer = require("nodemailer");

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

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

    const isMatch = await bcryptjs.compare(currentPassword, user.Pass);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Current password is incorrect" });
    }

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(newPassword, salt);

    user.password = hashedPassword;
    await user.save();

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

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await AddEmployee.findOne({ email });
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetLink = `http://localhost:5173/reset-password/${resetToken}`;

    user.resetToken = resetToken;
    user.resetTokenExpiry = Date.now() + 3600000;
    await user.save();

    // Send mail
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: "utsavvasoya99@gmail.com",
        pass: "uptdpvaxaavevvbp",
      },
    });

    const mailOptions = {
      from: process.env.SMTP_EMAIL,
      to: user.email,
      subject: "Password Reset Request",
      html: `
    <h2>Password Reset</h2>
    <p>Click the button below to reset your password. This link will expire in 1 hour.</p>
    <p style="margin-top: 20px;">
      <a href="${resetLink}" style="background: #10b981; color: white; padding: 10px 15px; text-decoration: none; border-radius: 5px;">
        Reset Password
      </a>
    </p>
    <p>If the button doesn't work, click or copy this link: <br />
      <a href="${resetLink}">${resetLink}</a>
    </p>
  `,
    };
    console.log(resetLink, "fe");
    await transporter.sendMail(mailOptions);

    return res.status(200).json({
      success: true,
      message: "Reset link sent to your email.",
    });
  } catch (error) {
    console.error("Forgot Password Error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    if (!token) {
      return res
        .status(400)
        .json({ success: false, message: "No token provided" });
    }

    if (!newPassword) {
      return res
        .status(400)
        .json({ success: false, message: "New password required" });
    }

    const user = await AddEmployee.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired token" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.Pass = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    return res
      .status(200)
      .json({ success: true, message: "Password reset successful" });
  } catch (err) {
    console.error("Reset Password Error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = {
  login,
  verify,
  changePassword,
  forgotPassword,
  resetPassword,
};
