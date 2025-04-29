const Department = require("../Models/Department");

const getDepartments = async (req, res) => {
  try {
    const departments = await Department.find();
    return res.status(200).json({ success: true, departments });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Add Department server error",
    });
  }
};

const addDepartment = async (req, res) => {
  try {
    const { dep_name, description } = req.body;
    const newDep = new Department({
      dep_name,
      description,
    });
    await newDep.save();
    return res.status(201).json({
      success: true,
      message: "Department added successfully",
      department: newDep,
    });
  } catch (error) {
    console.error("Error adding department:", error);
    return res
      .status(500)
      .json({ success: false, message: "add department server error" });
  }
};

const getDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const department = await Department.findById({ _id: id });
    return res.status(200).json({
      success: true,
      department,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Edit Department server error",
    });
  }
};

const updateDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const { dep_name, description } = req.body;
    const updateDep = await Department.findByIdAndUpdate(
      { _id: id },
      { dep_name, description }
    );
    return res.status(200).json({
      success: true,
      updateDep,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Update Department server error",
    });
  }
};

const deleteDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const deleteDep = await Department.findByIdAndDelete({ _id: id });
    return res.status(200).json({
      success: true,
      deleteDep,
    }); 
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Delete Department server error",
    });
  }
}

module.exports = { addDepartment, getDepartments, getDepartment, updateDepartment , deleteDepartment };
