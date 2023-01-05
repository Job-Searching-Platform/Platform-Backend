const mongoose = require("mongoose");

const recruiterEducationSchema = new mongoose.Schema({
    profile: {
    type: mongoose.Schema.ObjectId,
    ref: "RecruiterProfile",
    required: [true, "Education must belong to a Recruiter!"],
  },
  school: String,
  graduation: Date,
  degree: String,
  major: [String],
  GPA: String,
},
{ versionKey: false }
);


const RecruiterEducation = mongoose.model("RecruiterEducation", recruiterEducationSchema, "recruiterEducation");

module.exports = RecruiterEducation
