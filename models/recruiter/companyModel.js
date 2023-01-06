const mongoose = require("mongoose");

const companySchema = new mongoose.Schema(
  {
    title: String,
    subTitle:String,
    descriptionText: String,
    founder: [String],
    industry: [String],
    openedDate: Date,
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
    skills: [String],
    gallery: [String],
    photo:String,
    companyValue:Number,
  },
  { versionKey: false }
);

const Company = mongoose.model("Company", companySchema, "Company");

module.exports = Company;
