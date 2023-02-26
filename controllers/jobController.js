const jobCompany = require("./../models/recruiter/jobModel");
const Candidate = require("../models/candidate/candidateModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const factory = require("./controlMiddleware");
const AWS = require("aws-sdk");
const uuid = require("uuid").v4;

// ###############################
//     Recruiter Education
// ###############################
exports.getJob = factory.getOne(jobCompany);
exports.getJobs = factory.getAll(jobCompany);
exports.createJob = factory.createOne(jobCompany);
exports.updateJob = factory.updateOne(jobCompany);
exports.deleteJob = factory.deleteOne(jobCompany);

exports.getJobApplicants = catchAsync(async (req, res) => {
  const jobPosting = await jobCompany
    .findById(req.params.jobId)
    .populate("applications");

  const candidateIds = jobPosting.applications.map((app) => app.candidate);
  const doc = await Candidate.find({
    _id: { $in: candidateIds },
  });

  for (let i = 0; i < doc.length; i++) {
    doc[i].applications = [null];
  }

  res.status(200).json({
    status: "success",
    doc,
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
//     AWS for Icon upload
// ###############################
exports.icon_upload = catchAsync(async (req, res, next) => {
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
