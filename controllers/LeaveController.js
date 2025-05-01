const Leave = require("../Models/Leave");
const AddEmployee = require("../Models/AddEmp");

exports.addLeave = async (req, res) => {
  try {
    const { empId, emp_name, leavetype, fromDate, toDate } = req.body;

    if (!empId) {
      return res.status(400).json({
        success: false,
        error: "Employee ID is required",
      });
    }
    console.log(empId, "empId from leave add");
    const existingLeave = await Leave.findOne({ empId, fromDate, toDate });
    if (existingLeave) {
      return res.status(400).json({
        success: false,
        error:
          "Leave already exists for this employee during the specified dates",
      });
    }

    const newLeave = new Leave({
      empId,
      emp_name,
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

    console.log(Id, "Id");
    console.log(status, "status");

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
