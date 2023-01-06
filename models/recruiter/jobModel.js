const mongoose = require("mongoose");

const JobSchema = new mongoose.Schema(
  {
    company: {
      type: mongoose.Schema.ObjectId,
      ref: "Company",
      required: [true, "Job must belong to a Company!"],
    },
    title:String,
    descriptionText: String,
    responsibilitiesText: String,
    skillsText: Date,
    postedDate: {
      type: Date,
      default: Date.now(),
    },
    location: String,
    jobType: String,
    Remote: String,
    experience: String,
    skills: [String],
    salary: [Number],
    candidateNumber: Number,
    candidateLevel: [String],
    benefitsForCandidate: String,
  },
  { versionKey: false }
);

const Job = mongoose.model("Job", JobSchema, "companyJob");

module.exports = Job;
