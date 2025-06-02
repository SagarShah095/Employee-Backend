const Punch = require("../Models/PunchInModel");
exports.PunchGet = async (req, res) => {
  try {
    const punches = await Punch.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: punches });
  } catch (error) {
    console.error("Error getting punches:", error);
    res.status(500).json({ success: false, error: "Failed to get punches" });
  }
};

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

exports.PunchPost = async (req, res) => {
  try {
    const { emp_id, emp_name } = req.body;
    const now = new Date();
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const existingPunch = await Punch.findOne({
      emp_id,
      PunchIn: { $gte: todayStart, $lte: todayEnd },
    });

    if (existingPunch) {
      return res.status(400).json({
        success: false,
        message: "Already punched in today.",
      });
    }

    const punch = new Punch({
      emp_id,
      emp_name,
      PunchIn: now,
      status: "Present",
    });
    await punch.save();

    res.status(200).json({
      success: true,
      message: "Punch-in recorded",
      data: {
        punchInTime: punch.PunchIn,
        lunchStartTime: null,
        lunchEndTime: null,
        punchOutTime: null,
        state: "punched_in",
      },
    });
  } catch (error) {
    console.error("Punch-in error:", error);
    res.status(500).json({ success: false, message: "Failed to punch in" });
  }
};

exports.lunchStart = async (req, res) => {
  try {
    const { emp_id } = req.body;
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const punch = await Punch.findOne({
      emp_id,
      PunchIn: { $gte: todayStart, $lte: todayEnd },
      PunchOut: null,
    });

    if (!punch)
      return res
        .status(404)
        .json({ success: false, message: "No active punch-in." });
    if (punch.LunchStart)
      return res
        .status(400)
        .json({ success: false, message: "Lunch already started." });

    punch.LunchStart = new Date();
    await punch.save();
    res.status(200).json({
      success: true,
      message: "Lunch started",
      data: {
        lunchStartTime: punch.LunchStart,
        state: "lunch_in",
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.lunchEnd = async (req, res) => {
  try {
    const { emp_id } = req.body;
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const punch = await Punch.findOne({
      emp_id,
      PunchIn: { $gte: todayStart, $lte: todayEnd },
      PunchOut: null,
      LunchStart: { $ne: null },
    });

    if (!punch)
      return res
        .status(404)
        .json({ success: false, message: "No active lunch found." });
    if (punch.LunchEnd)
      return res
        .status(400)
        .json({ success: false, message: "Lunch already ended." });

    punch.LunchEnd = new Date();
    await punch.save();
    res.status(200).json({
      success: true,
      message: "Lunch ended",
      data: {
        lunchEndTime: punch.LunchEnd,
        state: "lunch_out",
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
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

    const punch = await Punch.findOne({
      emp_id,
      PunchIn: { $gte: todayStart, $lte: todayEnd },
      PunchOut: null,
    });

    if (!punch)
      return res.status(404).json({
        success: false,
        message: "No active punch-in found for today.",
      });

    if (punch.lockUntil && now < punch.lockUntil) {
      return res.status(403).json({
        success: false,
        message: `Punch out is locked until ${punch.lockUntil.toLocaleString()}.`,
      });
    }

    punch.PunchOut = now;
    punch.lockUntil = new Date(now.getTime() + 12 * 60 * 60 * 1000);
    await punch.save();

    res.status(200).json({
      success: true,
      message: "Punch-out recorded",
      data: {
        punchOutTime: punch.PunchOut,
        state: "punched_out",
      },
    });
  } catch (error) {
    console.error("Punch-out error:", error);
    res.status(500).json({ success: false, message: "Failed to punch out" });
  }
};

exports.getCurrentPunchState = async (req, res) => {
  try {
    const emp_id = req.params.emp_id;
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const punch = await Punch.findOne({
      emp_id,
      PunchIn: { $gte: todayStart, $lte: todayEnd },
    }).sort({ PunchIn: -1 });

    let state = "not_punched_in";
    let data = null;

    if (punch) {
      data = {
        punchInTime: punch.PunchIn,
        lunchStartTime: punch.LunchStart,
        lunchEndTime: punch.LunchEnd,
        punchOutTime: punch.PunchOut,
      };

      if (!punch.LunchStart) {
        state = "punched_in";
      } else if (punch.LunchStart && !punch.LunchEnd) {
        state = "lunch_in";
      } else if (punch.LunchStart && punch.LunchEnd && !punch.PunchOut) {
        state = "lunch_out";
      } else if (punch.PunchOut) {
        state = "punched_out";
      }
    }

    return res.status(200).json({
      success: true,
      state,
      data,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
