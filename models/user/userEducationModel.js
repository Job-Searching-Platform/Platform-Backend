const mongoose = require("mongoose");

const userEducationSchema = new mongoose.Schema({
  profile: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "Education must belong to a User!"],
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
  userEducationSchema,
  "userEducation"
);

module.exports = Education;
