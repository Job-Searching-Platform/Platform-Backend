const User = require("./../models/user/userModel");
const Job = require("./../models/recruiter/jobModel");
const userEducation = require("../models/user/userEducationModel");
const Application = require("../models/user/jobApplication");
const userExperience = require("./../models/user/userExperienceModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const factory = require("./controlMiddleware");
const AWS = require("aws-sdk");
const uuid = require("uuid").v4;
const mongoose = require("mongoose");

// ###############################
//     Middleware
// ###############################
// const filterObj = (obj, ...allowedFields) => {
//   const newObj = {};
//   Object.keys(obj).forEach((el) => {
//     if (allowedFields.includes(el)) newObj[el] = obj[el];
//   });
//   return newObj;
// };

// ###############################
//     User Name
// ###############################
exports.getUser = factory.getOne(User);
exports.getUserEduExp = factory.getOne(User, ["education", "experience"]);
exports.updateUser = factory.updateOne(User);
exports.createBookmark = factory.createBookmark(User, Job);
exports.deleteBookmark = factory.deleteBookmark(User, "user");
exports.getBookmark = factory.getBookmark(User, "bookmarkedJobs");
// ###############################
//     User Experience
// ###############################
exports.getUserExperience = factory.getOne(userExperience);
exports.createUserExperience = factory.createOne(userExperience);
exports.updateUserExperience = factory.updateOne(userExperience);
exports.deleteUserExperience = factory.deleteOne(userExperience);

// ###############################
//     User Education
// ###############################
exports.getUserEducation = factory.getOne(userEducation);
exports.createUserEducation = factory.createOne(userEducation);
exports.updateUserEducation = factory.updateOne(userEducation);
exports.deleteUserEducation = factory.deleteOne(userEducation);

// ####################################################
//           Apply to Jobs
// ####################################################
exports.applyJob = catchAsync(async (req, res) => {
  // console.log(req.body.user._id);
  const candidate = await User.findById(req.body.user._id);
  const jobPosting = await Job.findById(req.params.id);

  const existingApplication = await Application.findOne({
    candidate: candidate._id,
    jobPosting: jobPosting._id,
  });

  if (existingApplication) {
    return res
      .status(400)
      .send({ error: "You have already applied to this job posting." });
  }

  const application = new Application({
    candidate: candidate._id,
    jobPosting: jobPosting._id,
  });
  await application.save();

  candidate.applications.push(application._id);
  await candidate.save();

  jobPosting.applications.push(application._id);
  await jobPosting.save();
  console.log(candidate._id, "can ID");
  console.log(application._id, "app ID");
  console.log(jobPosting._id, "job ID");

  res.status(201).json({
    status: "success",
    doc: "Application submitted successfully",
  });
});

// ###############################
//     Get Applied Jobs List
// ###############################
exports.getAppliedJobs = catchAsync(async (req, res) => {
  const candidate = await User.findById(req.params.id).populate({
    path: "applications",
    populate: { path: "jobPosting" },
  });

  let result = candidate.applications.map((app) => app.jobPosting);

  res.status(200).json({
    status: "success",
    doc: result,
  });
});

// ###############################
//     Delete user account
// ###############################
exports.deleteMe = catchAsync(async (req, res) => {
  await User.findByIdAndUpdate(req.params.id, { active: false });

  res.status(204).json({
    status: "success",
    data: null,
  });
});

// ###############################
//     AWS for Media upload
// ###############################
exports.media_upload = catchAsync(async (req, res, next) => {
  const accessKeyId = `${process.env.AccessKeyID}`;
  const secretAccessKey = `${process.env.SecretAccessKey}`;

  const s3 = new AWS.S3({
    accessKeyId,
    secretAccessKey,
    region: "ap-south-1",
    apiVersion: "2010-12-01",
    signatureVersion: "v4",
  });

  const key = `${req.cookies.jwt.substr(1, 13)}/${uuid()}.jpeg`;
  s3.getSignedUrl(
    "putObject",
    {
      Bucket: "my-blog-bucket-closest-1029",
      ContentType: "image/jpeg",
      Key: key,
      Expires: 1000,
    },
    (err, url) => res.send({ key, url })
  );
});

// ###############################
//     AWS for Resume upload
// ###############################
exports.resume_upload = catchAsync(async (req, res, next) => {
  const accessKeyId = `${process.env.AccessKeyID}`;
  const secretAccessKey = `${process.env.SecretAccessKey}`;

  const s3 = new AWS.S3({
    accessKeyId,
    secretAccessKey,
    region: "ap-south-1",
    apiVersion: "2010-12-01",
    signatureVersion: "v4",
  });

  const key = `${req.cookies.jwt.substr(1, 13)}/${uuid()}.pdf`;
  s3.getSignedUrl(
    "putObject",
    {
      Bucket: "my-blog-bucket-closest-1029",
      ContentType: "application/pdf",
      Key: key,
      Expires: 1000,
    },
    (err, url) => res.send({ key, url })
  );
});

// ###############################
//     Middleware
// ###############################
// exports.getMe = (req, res, next) => {
//   req.params.id = req.user.id;
//   next();
// };
