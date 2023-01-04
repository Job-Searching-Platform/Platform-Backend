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
  socialLinks: [
    {
      website: String,
      linkedin: String,
      github: String,
    },
  ],
  photo: String,
  achievement: String,
  bio: String,
  skills:[String],
  opentoRoles:[String],
  primaryRole:String,
  yearofExperience:Number,
  resume:String,

});


// Virtual populate
userProfileSchema.virtual('education', {
  ref: 'userEducation',
  foreignField: 'profile',
  localField: '_id'
});

// Virtual populate
userProfileSchema.virtual('experience', {
  ref: 'userExperience',
  foreignField: 'profile',
  localField: '_id'
});

// userProfileSchema.pre(/^find/, function (next) {
//   this.populate("user").populate({
//     path: "tour",
//     select: "name",
//   });
//   next();
// });

const Profile = mongoose.model("Profile", userProfileSchema, "userProfile");

module.exports = Profile;
