const crypto = require("crypto");
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

// Define the experience schema
const experienceSchema = new mongoose.Schema({
  company: String,
  title: String,
  startDate: Date,
  endDate: Date,
  description: String,
  tags: [String],
});

// Define the education schema
const educationSchema = new mongoose.Schema({
  school: String,
  graduation: Date,
  degree: String,
  major: [String],
  GPA: String,
});

const candidateSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Please tell us your name!"],
    },
    email: {
      type: String,
      required: [true, "Please provide your email"],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, "Please provide a valid email"],
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      minlength: 8,
      select: false,
    },
    confirmPassword: {
      type: String,
      validate: {
        validator: function (el) {
          return el === this.password;
        },
        message: "Passwords are not the same!",
      },
    },

    experiences: [experienceSchema],
    education: [educationSchema],
    bookmarkedJobs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Job",
      },
    ],
    // bookmarkedBy: [
    //   {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Recruiter',
    //   },
    // ],
    bookmarked: {
      type: Boolean,
      default: false,
    },
    applications: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Application",
      },
    ],
    photo: String,
    __v: { type: Number, select: false },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
      type: Boolean,
      default: true,
      select: false,
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
    achievement: String,
    bio: String,
    skills: [String],
    opentoRoles: [String],
    primaryRole: String,
    yearofExperience: Number,
    resume: String,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

candidateSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  this.password = await bcrypt.hash(this.password, 12);

  this.confirmPassword = undefined;
  next();
});

candidateSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) {
    return next();
  }
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

candidateSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

candidateSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

candidateSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

candidateSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const Candidate = mongoose.model("Candidate", candidateSchema, "userAdmin");

module.exports = Candidate;
