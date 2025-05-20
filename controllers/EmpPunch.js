const Punch = require("../Models/PunchInModel")

exports.PunchPost = async (req, res) => {

    try {
        const { emp_id, emp_name, PunchIn, PunchOut } = req.body;

        if (!emp_id) {
            return res.status(400).json({
                success: false,
                error: "Employee ID is required",
            });
        }
        console.log(emp_id, "emp_id from leave add");
        // const existingLeave = await Leave.findOne({ emp_id, fromDate, toDate });
        // if (existingLeave) {
        //     return res.status(400).json({
        //         success: false,
        //         error:
        //             "Leave already exists for this employee during the specified dates",
        //     });
        // }

        const newPunch = new Punch({
            emp_id,
            emp_name,
            PunchIn,
            PunchOut,
        })

        await newPunch.save()
        res.status(201).json({
            success: true,
            message: "Punch added successfully",
            data: newPunch,
        });
    } catch (error) {
        console.error("Error adding Punch:", error);
        res.status(500).json({ success: false, error: "Failed to add Punch" });
    }
}


exports.PunchGet = async (req, res) => {
  try {
    const punch = await Punch.find();

    if (!punch) {
      return res.status(404).json({ success: false, error: "Punch data not found" });
    }
    res.status(200).json({ success: true, data: punch });
  } catch (error) {
    console.error("Error fetching Leave:", error);
    res.status(500).json({ success: false, error: "Failed to fetch Leave" });
  }
};
