const jwt = require("jsonwebtoken");
const User = require("../Models/User");
const AddEmployee = require("../Models/AddEmp");

const verifyUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer")) {
      return res
        .status(401)
        .json({ success: false, message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, "ABCDEFGHIJKLMNOPQRSTUVWXYZ");
    if (!decoded) {
      return res.status(401).json({ success: false, message: "Invalid token" });
    }

    const user = await User.findById(decoded._id).select("-password");

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Token verification error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

const verifyUserFromEmployee = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ success: false, message: "No token provided" });
    }

    const decoded = jwt.verify(token, "ABCDEFGHIJKLMNOPQRSTUVWXYZ");

    const employee = await AddEmployee.findById(decoded._id);
    if (!employee) {
      return res.status(401).json({ success: false, message: "Employee not found" });
    }

    req.user = employee;
    next();
  } catch (error) {
    console.error("Employee token verification failed", error);
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
};

module.exports = { verifyUser, verifyUserFromEmployee };
