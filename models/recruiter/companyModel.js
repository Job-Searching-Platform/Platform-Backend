const mongoose = require("mongoose");

const companySchema = new mongoose.Schema(
  {
    title: String,
    subTitle:String,
    descriptionText: String,
    founder: [String],
    industry: [String],
    postedDate: {
      type: Date,
      default: Date.now(),
    },
    address: [
      {
        country: [String],
        city: [String],
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
    companySize:Number,
    jobType: String,
    Remote: String,
    experience: String,
    skills: [String],
    salaries: [Number],
    candidateQuantity: Number,
    candidateLevels: [String],
    photos: [String],
    companyValue:Number,
  },
  { versionKey: false }
);

const Company = mongoose.model("Company", companySchema, "Company");

module.exports = Company;
