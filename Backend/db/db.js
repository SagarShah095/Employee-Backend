const mongoose = require("mongoose");

const connectToDatabase = async () => {
  try {
    await mongoose.connect("mongodb+srv://sagarshah:sagarshah@cluster0.purofkj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");
    console.log("✅ MongoDB Connected");
  } catch (err) {
    console.log("❌ MongoDB Error:", err);
  }
};

module.exports = connectToDatabase;
