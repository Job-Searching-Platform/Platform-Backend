const mongoose = require("mongoose");

const userExperienceSchema = new mongoose.Schema({
  profile: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "Experience must belong to a User!"],
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
  userExperienceSchema,
  "userExperience"
);

module.exports = Experience;
