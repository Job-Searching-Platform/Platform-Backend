const Candidate = require("../models/candidate/candidateModel");
const Job = require("../models/recruiter/jobModel");
const candidateEducation = require("../models/candidate/candidateEducationModel");
const Application = require("../models/candidate/jobApplicationModel");
const candidateExperience = require("../models/candidate/candidateExperienceModel");
const catchAsync = require("../utils/catchAsync");
const factory = require("./controlMiddleware");
const AWS = require("aws-sdk");
const uuid = require("uuid").v4;

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
//     Candidate Name
// ###############################
exports.getCandidate = factory.getOne(Candidate);
exports.getAllCandidates = factory.getAll(Candidate);
exports.getCandidateEduExp = factory.getOne(Candidate, ["education", "experience"]);
exports.updateCandidate = factory.updateOne(Candidate);
exports.createBookmark = factory.createBookmark(Candidate, Job, "candidate");
exports.deleteBookmark = factory.deleteBookmark(Candidate, "candidate");
exports.getBookmark = factory.getBookmark(Candidate, "bookmarkedJobs");

// ###############################
//     Candidate Experience
// ###############################
exports.getCandidateExperience = factory.getOne(candidateExperience);
exports.createCandidateExperience = factory.createOne(candidateExperience);
exports.updateCandidateExperience = factory.updateOne(candidateExperience);
exports.deleteCandidateExperience = factory.deleteOne(candidateExperience);

// ###############################
//     Candidate Education
// ###############################
exports.getCandidateEducation = factory.getOne(candidateEducation);
exports.createCandidateEducation = factory.createOne(candidateEducation);
exports.updateCandidateEducation = factory.updateOne(candidateEducation);
exports.deleteCandidateEducation = factory.deleteOne(candidateEducation);

// ####################################################
//           Apply to Jobs
// ####################################################
exports.applyJob = catchAsync(async (req, res) => {
  // console.log(req.body.candidate._id);
  const candidate = await Candidate.findById(req.params.candidateID);
  const jobPosting = await Job.findById(req.params.jobID);

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
  const candidate = await Candidate.findById(req.params.candidateID).populate({
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
//     Delete candidate account
// ###############################
exports.deleteMe = catchAsync(async (req, res) => {
  await Candidate.findByIdAndUpdate(req.params.id, { active: false });

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
//   req.params.id = req.candidate.id;
//   next();
// };
