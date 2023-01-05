const mongoose = require("mongoose");

const recruiterProfileSchema = new mongoose.Schema({
  recruiter: {
    type: mongoose.Schema.ObjectId,
    ref: "Recruiter",
    required: [true, "Profile must belong to a Recruiter!"],
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

},
{
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
},
{ versionKey: false }
);


// Virtual populate
recruiterProfileSchema.virtual('education', {
  ref: 'RecruiterEducation',
  foreignField: 'profile',
  localField: '_id'
});

// Virtual populate
recruiterProfileSchema.virtual('experience', {
  ref: 'RecruiterExperience',
  foreignField: 'profile',
  localField: '_id'
});

// recruiterProfileSchema.pre(/^find/, function (next) {
//   this.populate("user").populate({
//     path: "tour",
//     select: "name",
//   });
//   next();
// });

const RecruiterProfile = mongoose.model("RecruiterProfile", recruiterProfileSchema, "recruiterProfile");

module.exports = RecruiterProfile;
