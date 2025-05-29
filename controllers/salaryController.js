const Salary = require("../Models/salaryModel");
const AddEmployee = require("../Models/AddEmp");
const { default: mongoose } = require("mongoose");

// Add Salary
exports.addSalary = async (req, res) => {
  try {
    const {mainEmpId, dept, emp_name, empId, basicSalary, allowances, deductions, payDate } = req.body;

    const totalSalary = basicSalary + allowances - deductions;

    const newSalary = new Salary({
      empId,
      mainEmpId,
      emp_name,
      dept,
      basicSalary,
      allowances,
      deductions,
      totalSalary,
      payDate,
    });


    await newSalary.save();
    res
      .status(201)
      .json({
        success: true,
        message: "Salary added successfully",
        data: newSalary,
      });
  } catch (error) {
    console.error("Error adding salary:", error);
    res.status(500).json({ success: false, error: "Failed to add salary" });
  }
};

exports.getEmployeesByDepartment = async (req, res) => {
  try {
    const { Dept } = req.params;
    const employees = await AddEmployee.find({ Department: Dept });

    if (!employees) {
      return res
        .status(404)
        .json({
          success: false,
          error: "No employees found in this department",
        });
    }

    res.status(200).json({ success: true, employees });
  } catch (error) {
    console.error("Error fetching employees by department:", error);
    res
      .status(500)
      .json({ success: false, error: "Failed to fetch employees" });
  }
};

// Get Salary by Employee ID
exports.getSalaryByEmployee = async (req, res) => {
  try {
    const { empId } = req.params;
    const salary = await Salary.findOne({ empId }).populate("empId");

    if (!salary) {
      return res
        .status(404)
        .json({ success: false, error: "Salary not found for this employee" });
    }

    res.status(200).json({ success: true, data: salary });
  } catch (error) {
    console.error("Error fetching salary:", error);
    res.status(500).json({ success: false, error: "Failed to fetch salary" });
  }
};


exports.SalaryAllData = async (req, res) => {
  try {
    const salaries = await Salary.find({});
    res.status(200).json({
      success: true,
      data: salaries,
    });
  } catch (error) {
    console.error("Error fetching salaries:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};


// Update Salary by Employee ID
exports.updateSalary = async (req, res) => {
  try {
    const { empId } = req.params;
    const { basicSalary, allowances, deductions, payDate } = req.body;

    const totalSalary = basicSalary + allowances - deductions;

    const updatedSalary = await Salary.findOneAndUpdate(
      { empId },
      { basicSalary, allowances, deductions, totalSalary, payDate },
      { new: true }
    );

    if (!updatedSalary) {
      return res
        .status(404)
        .json({ success: false, error: "Salary not found" });
    }

    res
      .status(200)
      .json({
        success: true,
        message: "Salary updated successfully",
        data: updatedSalary,
      });
  } catch (error) {
    console.error("Error updating salary:", error);
    res.status(500).json({ success: false, error: "Failed to update salary" });
  }
};

// Delete Salary by Employee ID
exports.deleteSalary = async (req, res) => {
  try {
    const { empId } = req.params;

    const deletedSalary = await Salary.findOneAndDelete({ empId });

    if (!deletedSalary) {
      return res
        .status(404)
        .json({ success: false, error: "Salary not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Salary deleted successfully" });
  } catch (error) {
    console.error("Error deleting salary:", error);
    res.status(500).json({ success: false, error: "Failed to delete salary" });
  }
};
