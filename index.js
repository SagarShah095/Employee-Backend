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
const https = require("https");
require("dotenv").config();

connectToDatabase();
const app = express();

const server = https.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "https://employee-frontend-i28v.onrender.com",
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {


  socket.on("join", (userId) => {
    socket.join(userId);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected", socket.id);
  });
});
app.set("io", io);

const allowedOrigins = [
  "https://employee-frontend-i28v.onrender.com",
  "http://localhost:3000", // Common default for React/Vite
  "http://localhost:5173", // Common default for Vite
  "http://127.0.0.1:3000",
];

// Configure CORS to allow multiple origins
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg =
          "The CORS policy for this site does not allow access from the specified Origin.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
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
