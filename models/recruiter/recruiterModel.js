const crypto = require("crypto");
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

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
    passwordConfirm: {
      type: String,
      required: [true, "Please confirm your password"],
      validate: {
        validator: function (el) {
          return el === this.password;
        },
        message: "Passwords are not the same!",
      },
    },
    // bookmarkedCandidates: [
    //   {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Candidate',
    //   },
    // ],
    
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

// Virtual Education
recruiterSchema.virtual("education", {
  ref: "RecruiterEducation",
  foreignField: "profile",
  localField: "_id",
});

// Virtual Experience
recruiterSchema.virtual("experience", {
  ref: "RecruiterExperience",
  foreignField: "profile",
  localField: "_id",
});

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
