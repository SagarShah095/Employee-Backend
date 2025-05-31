const { default: mongoose } = require("mongoose");
const Project = require("../Models/Project");
const NotificationModel = require("../Models/NotificationModel");

// Create a new project
const createProject = async (req, res) => {
  try {
    const {
      title,
      description,
      status,
      startDate,
      endDate,
      assignedEmployees,
      technologies,
    } = req.body;
    const project = await Project.create({
      title,
      description,
      status,
      startDate,
      endDate,
      technologies,
      assignedEmployees,
    //   createdBy: req.user._id,
    });
    const io = req.app.get("io");
    for (const userId of assignedEmployees) {
      const message = `You have been assigned to the project "${project.title}".`;
      await NotificationModel.create({
        userId,
        message,
        type: "new_project",
        projectId: project._id,
      });

      // Emit real-time notification to user's room
      io.to(userId.toString()).emit("newProjectNotification", {
        message,
        projectId: project._id,
      });
    }

    res.status(201).json({ message: "Project created and notifications sent", project });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create project" });
  }
};

const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find();
    res
      .status(201)
      .json({ message: "data fetch successfully", data: projects });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching projects", error: error.message });
  }
};

// try {
//     const projects = await Project.find()
//       .populate('assignedEmployees', 'name email role') // Populate specific fields if needed
//       .exec();

//     res.status(200).json({ projects });
//   }
const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.json(project);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching project", error: error.message });
  }
};

// Update project
const updateProject = async (req, res) => {
  try {
    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true, runValidators: true }
    );
    if (!updatedProject) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.json({
      message: "Project updated successfully",
      project: updatedProject,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating project", error: error.message });
  }
};

// Soft delete project
const deleteProject = async (req, res) => {
  try {
    const deletedProject = await Project.findByIdAndDelete(
      req.params.id,
      { deleted: true },
      { new: true }
    );
    if (!deletedProject) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.json({
      message: "Project deleted successfully",
      project: deletedProject,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting project", error: error.message });
  }
};

module.exports = {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
};
