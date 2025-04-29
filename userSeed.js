const bcryptjs = require("bcryptjs");
const User = require("./Models/User");
const connectToDatabase = require("./db/db");
const { model } = require("mongoose");

 const userRegister = async () => {
  await connectToDatabase();
  try {
    const hashPassword = await bcryptjs.hash("admin", 10);
    const newUser = new User({
      name: "Admin",
      email: "admin@gmail.com",
      password: hashPassword,
      role: "admin",
    });
    await newUser.save();
    console.log("✅ Admin user created");
  } catch (err) {
    console.log("❌ Error creating admin:", err);
  }
};


module.exports = { userRegister };