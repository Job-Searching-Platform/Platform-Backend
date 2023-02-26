const mongoose = require("mongoose");

const candidateExperienceSchema = new mongoose.Schema({
  profile: {
    type: mongoose.Schema.ObjectId,
    ref: "Candidate",
    required: [true, "Experience must belong to a Candidate!"],
  },
  __v: { type: Number, select: false },
  company: String,
  title: String,
  startDate: Date,
  endDate: Date,
  description: String,
  tags: [String],
});
 
const Experience = mongoose.model(
  "Experience",
  candidateExperienceSchema,
  "userExperience"
);

module.exports = Experience;
