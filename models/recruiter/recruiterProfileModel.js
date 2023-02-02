const mongoose = require("mongoose");

const recruiterProfileSchema = new mongoose.Schema(
  {
    recruiter: {
      type: mongoose.Schema.ObjectId,
      ref: "Recruiter",
      required: [true, "Profile must belong to a Recruiter!"],
    },
    address: [
      {
        country: String,
        city: String,
        phoneNumber: Number,
      },
    ],
    socialLinks: [
      {
        website: String,
        linkedin: String,
        github: String,
      },
    ],
    __v: { type: Number, select: false },
    achievement: String,
    bio: String,
    skills: [String],
    primaryRole: String,
    yearofExperience: Number,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual populate
recruiterProfileSchema.virtual("education", {
  ref: "RecruiterEducation",
  foreignField: "profile",
  localField: "_id",
});

// Virtual populate
recruiterProfileSchema.virtual("experience", {
  ref: "RecruiterExperience",
  foreignField: "profile",
  localField: "_id",
});

const RecruiterProfile = mongoose.model(
  "RecruiterProfile",
  recruiterProfileSchema,
  "recruiterProfile"
);

module.exports = RecruiterProfile;
