const express = require("express");
const cors = require("cors");
const { userRegister } = require("./userSeed");
const authRoutes = require("./routes/auth");
const departmentRoutes = require("./routes/department");
const connectToDatabase = require("./db/db");
const AddEmp = require("./routes/AddEmp");
const salaryRouter = require("./routes/salaryRouter")
const leaveRouter = require("./routes/Leaveroute");
const punchRouter = require("./routes/PunchRouter")


connectToDatabase();
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public/uploads"));
app.use("/api/auth", authRoutes);
app.use("/api/department", departmentRoutes);
app.use("/api/employee", AddEmp);
app.use("/api/salary", salaryRouter);
app.use("/api/leave", leaveRouter);
app.use("/api/punch", punchRouter);
userRegister();
app.listen(5000, () => {
  console.log(`Server is running on Port 5000`);
});
