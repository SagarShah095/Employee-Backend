const Punch = require("../Models/PunchInModel");
exports.PunchPost = async (req, res) => {
  try {
    const { emp_id, emp_name } = req.body;

    const now = new Date(); // get current timestamp
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    // Check if already punched in today
    const existingPunch = await Punch.findOne({
      emp_id,
      PunchIn: { $gte: todayStart, $lte: todayEnd },
    });

    if (existingPunch) {
      return res
        .status(400)
        .json({ success: false, message: "Already punched in today." });
    }

    const punch = new Punch({
      emp_id,
      emp_name,
      PunchIn: now, // Store exact time
    });
    await punch.save();

    res
      .status(200)
      .json({ success: true, message: "Punch-in recorded", data: punch });
  } catch (error) {
    console.error("Punch-in error:", error);
    res.status(500).json({ success: false, message: "Failed to punch in" });
  }
};

exports.PunchOut = async (req, res) => {
  try {
    const { emp_id } = req.body;

    const now = new Date();
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    // 🔍 Find today's punch where PunchOut is null
    const punch = await Punch.findOne({
      emp_id,
      PunchIn: { $gte: todayStart, $lte: todayEnd },
      PunchOut: null,
    });

    if (!punch) {
      return res.status(404).json({
        success: false,
        message: "No active punch-in found for today.",
      });
    }

    // 🔒 Check if lockUntil exists and is still active
    if (punch.lockUntil && now < punch.lockUntil) {
      return res.status(403).json({
        success: false,
        message: `Punch out is locked until ${punch.lockUntil.toLocaleString()}.`,
      });
    }

    punch.PunchOut = now;
    punch.lockUntil = new Date(now.getTime() + 12 * 60 * 60 * 1000); // 🔐 12 hours lock
    await punch.save();

    res.status(200).json({
      success: true,
      message: "Punch-out recorded and locked for 12 hours.",
      data: punch,
    });
  } catch (error) {
    console.error("Punch-out error:", error);
    res.status(500).json({ success: false, message: "Failed to punch out" });
  }
};


// 👀 Get All Punches
exports.PunchGet = async (req, res) => {
  try {
    const punches = await Punch.find().sort({ createdAt: -1 }); // latest first
    res.status(200).json({ success: true, data: punches });
  } catch (error) {
    console.error("Error getting punches:", error);
    res.status(500).json({ success: false, error: "Failed to get punches" });
  }
};

// 📅 Today's Attendance Summary
exports.getTodayAttendanceSummary = async (req, res) => {
  try {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const punches = await Punch.find({
      PunchIn: { $gte: todayStart, $lte: todayEnd },
    });

    const presentSet = new Set();
    punches.forEach((punch) => presentSet.add(punch.emp_id));

    res.status(200).json({
      success: true,
      summary: {
        present: presentSet.size,
      },
    });
  } catch (error) {
    console.error("Error getting attendance summary:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.getLatestPunchByEmpId = async (req, res) => {
  try {
    const empId = req.params.emp_id;

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const punch = await Punch.findOne({
      emp_id: empId,
      PunchIn: { $gte: todayStart, $lte: todayEnd },
    }).sort({ PunchIn: -1 });

    let alreadyPunchedToday = false;
    if (punch) {
      if (punch.PunchIn && !punch.PunchOut) {
        alreadyPunchedToday = "in";
      } else if (punch.PunchIn && punch.PunchOut) {
        alreadyPunchedToday = "out";
      }
    }

    res.status(200).json({
      success: true,
      punch,
      alreadyPunchedToday,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
