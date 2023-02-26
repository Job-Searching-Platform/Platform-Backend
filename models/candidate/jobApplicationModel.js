const mongoose = require("mongoose");

const ApplicationSchema = new mongoose.Schema({
  candidate: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Candidate",
    required: true,
  },
  jobPosting: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job",
    required: true,
  },
});

const Application = mongoose.model(
  "Application",
  ApplicationSchema,
  "Job Application"
);
module.exports = Application;
