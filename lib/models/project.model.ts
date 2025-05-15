import mongoose from "mongoose"

const projectSchema = new mongoose.Schema({
  title: { type: String },
  technologies: { type: String },
  startDate: { type: String },
  endDate: { type: String },
  projectLink: { type: String },
  projectSummary: { type: String },
})

const Project = mongoose.models.Project || mongoose.model("Project", projectSchema)

export default Project
