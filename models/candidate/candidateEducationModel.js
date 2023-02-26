const mongoose = require("mongoose");

const candidateEducationSchema = new mongoose.Schema({
  profile: {
    type: mongoose.Schema.ObjectId,
    ref: "Candidate",
    required: [true, "Education must belong to a Candidate!"],
  },
  __v: { type: Number, select: false },
  school: String,
  graduation: Date,
  degree: String,
  major: [String],
  GPA: String,
});

const Education = mongoose.model(
  "Education",
  candidateEducationSchema,
  "userEducation"
);

module.exports = Education;
