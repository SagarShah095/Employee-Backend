const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    status: {
      type: String,
      enum: ["Planned", "In Progress", "Completed"],
      default: "Planned",
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    assignedEmployees: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    technologies: [{ type: String, required: true }],
    // createdBy: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "Admin",
    //   required: true,
    // },
  },
  {
    timestamps: true, // This automatically adds createdAt and updatedAt fields
  }
);

// 🕒 Virtual field to calculate project duration (in days)
projectSchema.virtual("duration").get(function () {
  if (this.startDate && this.endDate) {
    const durationInMs = this.endDate - this.startDate;
    return Math.ceil(durationInMs / (1000 * 60 * 60 * 24)); // Convert to days
  }
  return null;
});

module.exports = mongoose.model("Project", projectSchema);
