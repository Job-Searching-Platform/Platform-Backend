const mongoose = require("mongoose");

const userProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "Profile must belong to a User!"],
  },
  address: [
    {
      country: String,
      city:String,
      phoneNumber:Number,
    },
  ],
  photo: String,
  achievements: Number,
  bio: String,
  socialProfile: [
    {
      website: String,
      linkedin: String,
      github: String,
    },
  ],
  experience: [
    {
      company: String,
      title: String,
      startDate: Date,
      endDate: Date,
      description: String,
      tags: [String],
    },
  ],
});

userProfileSchema.pre(/^find/, function (next) {
  this.populate("user").populate({
    path: "tour",
    select: "name",
  });
  next();
});

const Profile = mongoose.model("Profile", userProfileSchema);

module.exports = Profile;
