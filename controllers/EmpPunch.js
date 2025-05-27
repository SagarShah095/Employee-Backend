const Punch = require("../Models/PunchInModel");

// Add new punch (PunchPost)
// Update punch out for existing punch
exports.PunchOut = async (req, res) => {
  try {
    const { emp_id, PunchOut } = req.body;

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const punch = await Punch.findOne({
      emp_id,
      PunchIn: { $gte: todayStart, $lte: todayEnd },
      PunchOut: null,
    });

    if (!punch) {
      return res.status(404).json({ success: false, message: "No punch-in found for today." });
    }

    punch.PunchOut = PunchOut;
    await punch.save();

    res.status(200).json({ success: true, message: "Punch-out successful", data: punch });
  } catch (error) {
    console.error("Error during punch-out:", error);
    res.status(500).json({ success: false, message: "Failed to punch out" });
  }
};


// Get all punches (PunchGet)
exports.PunchGet = async (req, res) => {
  try {
    const punches = await Punch.find().sort({ createdAt: -1 }); // latest first
    res.status(200).json({
      success: true,
      data: punches,
    });
  } catch (error) {
    console.error("Error getting punches:", error);
    res.status(500).json({ success: false, error: "Failed to get punches" });
  }
};

// Add new punch (PunchIn)
exports.PunchPost = async (req, res) => {
  try {
    const { emp_id, emp_name, PunchIn } = req.body;

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    // Check if already punched in today
    const existingPunch = await Punch.findOne({
      emp_id,
      PunchIn: { $gte: todayStart, $lte: todayEnd }
    });

    if (existingPunch) {
      return res.status(400).json({ success: false, message: "Already punched in today." });
    }

    const punch = new Punch({ emp_id, emp_name, PunchIn });
    await punch.save();

    res.status(200).json({ success: true, message: "Punch-in recorded", data: punch });
  } catch (error) {
    console.error("Punch-in error:", error);
    res.status(500).json({ success: false, message: "Failed to punch in" });
  }
};

// Punch out
exports.PunchOut = async (req, res) => {
  try {
    const { emp_id, PunchOut } = req.body;

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const punch = await Punch.findOne({
      emp_id,
      PunchIn: { $gte: todayStart, $lte: todayEnd },
      PunchOut: null
    });

    if (!punch) {
      return res.status(404).json({ success: false, message: "No active punch-in for today." });
    }

    punch.PunchOut = PunchOut;
    await punch.save();

    res.status(200).json({ success: true, message: "Punch-out recorded", data: punch });
  } catch (error) {
    console.error("Punch-out error:", error);
    res.status(500).json({ success: false, message: "Failed to punch out" });
  }
};




// Get today's attendance summary
exports.getTodayAttendanceSummary = async (req, res) => {
  try {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const punches = await Punch.find({
      createdAt: { $gte: todayStart, $lte: todayEnd }
    });

    const presentSet = new Set();

    punches.forEach(punch => {
      if ((punch.status || "Present") === "Present") {
        presentSet.add(punch.emp_id);
      }
    });

    res.status(200).json({
      success: true,
      summary: {
        present: presentSet.size,
        // Add other stats if needed
      }
    });
  } catch (error) {
    console.error("Error getting attendance summary:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


// this is backend write in this