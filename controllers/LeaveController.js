const Leave = require("../Models/Leave");
const AddEmployee = require("../Models/AddEmp");

exports.addLeave = async (req, res) => {
  try {
    const { emp_id, emp_name, leavetype, desc, fromDate, toDate } = req.body;

    if (!emp_id) {
      return res.status(400).json({
        success: false,
        error: "Employee ID is required",
      });
    }
    const existingLeave = await Leave.findOne({ emp_id, fromDate, toDate });
    if (existingLeave) {
      return res.status(400).json({
        success: false,
        error:
          "Leave already exists for this employee during the specified dates",
      });
    }

    const newLeave = new Leave({
      emp_id,
      emp_name,
      desc,
      leavetype,
      fromDate,
      toDate,
    });

    await newLeave.save();

    res.status(201).json({
      success: true,
      message: "Leave added successfully",
      data: newLeave,
    });
  } catch (error) {
    console.error("Error adding Leave:", error);
    res.status(500).json({ success: false, error: "Failed to add Leave" });
  }
};

exports.getLeave = async (req, res) => {
  try {
    const leave = await Leave.find();

    if (!leave) {
      return res.status(404).json({ success: false, error: "Leave not found" });
    }
    res.status(200).json({ success: true, data: leave });
  } catch (error) {
    console.error("Error fetching Leave:", error);
    res.status(500).json({ success: false, error: "Failed to fetch Leave" });
  }
};

exports.putLeave = async (req, res) => {
  try {
    const Id = req.params.Id;
    const { status } = req.body;

    const leave = await Leave.findByIdAndUpdate(
      Id,
      { status },
      { new: true } // returns the updated document
    );

    if (!leave) {
      return res.status(404).json({ success: false, error: "Leave not found" });
    }

    res.status(200).json({ success: true, data: leave });
  } catch (error) {
    console.error("Error updating Leave:", error);
    res.status(500).json({ success: false, error: "Failed to update Leave" });
  }
};

exports.getData = async (req, res) => {
  try {
    const leave = await Leave.findOne();

    if (!leave) {
      return res.status(404).json({ success: false, error: "Leave not found" });
    }
    res.status(200).json({ success: true, data: leave });
  } catch (error) {
    console.error("Error fetching Leave:", error);
    res.status(500).json({ success: false, error: "Failed to fetch Leave" });
  }
};
