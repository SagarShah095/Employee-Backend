const express = require("express");
const cors = require("cors");
const { userRegister } = require("./userSeed");
const authRoutes = require("./routes/auth");
const departmentRoutes = require("./routes/department");
const connectToDatabase = require("./db/db");
const AddEmp = require("./routes/AddEmp");
const salaryRouter = require("./routes/salaryRouter");
const leaveRouter = require("./routes/Leaveroute");
const punchRouter = require("./routes/PunchRouter");
const projectRouter = require("./routes/ProjectRoute");
const notificationRouter = require("./routes/notificationRoute");
const { Server } = require("socket.io");
const http = require("http");

connectToDatabase();
const app = express();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    // origin: "https://employee-frontend-i28v.onrender.com", // Frontend URL
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("User connected", socket.id);

  socket.on("join", (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined room`);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected", socket.id);
  });
});
// Make io accessible in routes
app.set("io", io);

// app.use(
//   cors({
//     origin: "https://employee-frontend-i28v.onrender.com",
//     credentials: true,
//     methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//   })
// );
app.use(
  cors({
    origin: "*",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());
app.use(express.static("public/uploads"));
app.use("/api/auth", authRoutes);
app.use("/api/department", departmentRoutes);
app.use("/api/employee", AddEmp);
app.use("/api/salary", salaryRouter);
app.use("/api/leave", leaveRouter);
app.use("/api/punch", punchRouter);
app.use("/api/projects", projectRouter);
app.use("/api/notifications", notificationRouter);

userRegister();
app.listen(4000, () => {
  console.log(`Server is running on Port 4000`);
});
