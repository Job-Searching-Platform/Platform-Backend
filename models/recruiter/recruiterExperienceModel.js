const mongoose = require("mongoose");

const recruiterExperienceSchema = new mongoose.Schema({
 profile: {
    type: mongoose.Schema.ObjectId,
    ref: "RecruiterProfile",
    required: [true, "Experience must belong to a Recruiter!"],
  },
  company: String,
  title: String,
  startDate: Date,
  endDate: Date,
  description: String,
  tags: [String],
},
{ versionKey: false }
);


const RecruiterExperience = mongoose.model("RecruiterExperience", recruiterExperienceSchema, "recruiterExperience");

module.exports = RecruiterExperience;
