const mongoose = require("mongoose");

const userExperienceSchema = new mongoose.Schema({
 profile: {
    type: mongoose.Schema.ObjectId,
    ref: "Profile",
    required: [true, "Experience must belong to a User!"],
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


const Experience = mongoose.model("Experience", userExperienceSchema, "userExperience");

module.exports = Experience;
