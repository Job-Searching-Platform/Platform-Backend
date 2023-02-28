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

const recruiterSchema = new mongoose.Schema(
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
    bookmarkedCandidates: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Candidate",
      },
    ],
    passwordConfirm: {
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

    __v: { type: Number, select: false },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    photo: String,
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
    primaryRole: String,
    yearofExperience: Number,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual Job
recruiterSchema.virtual("job", {
  ref: "Job",
  foreignField: "recruiter",
  localField: "_id",
});

// Virtual Company
recruiterSchema.virtual("company", {
  ref: "Company",
  foreignField: "recruiter",
  localField: "_id",
});

recruiterSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  this.password = await bcrypt.hash(this.password, 12);

  this.passwordConfirm = undefined;
  next();
});

recruiterSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) {
    return next();
  }
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

recruiterSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

recruiterSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

recruiterSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

recruiterSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const Recruiter = mongoose.model(
  "Recruiter",
  recruiterSchema,
  "recruiterAdmin"
);

module.exports = Recruiter;
