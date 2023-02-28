const mongoose = require("mongoose");

const companySchema = new mongoose.Schema(
  {
    recruiter: {
      type: mongoose.Schema.ObjectId,
      ref: "Recruiter",
      required: [true, "Copmany must belong to a Recruiter!"],
    },
    __v: { type: Number, select: false },
    title: String,
    subTitle: String,
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
      },
    ],
    companySize: Number,
    skills: [String],
    gallery: [String],
    photo: String,
    companyValue: Number,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual Job
companySchema.virtual("job", {
  ref: "Job",
  foreignField: "company",
  localField: "_id",
});

const Company = mongoose.model("Company", companySchema, "Company");

module.exports = Company;
