const Recruiter = require("./../models/recruiter/recruiterModel");
const recruiterEducation = require("../models/recruiter/recruiterEducationModel");
const recruiterExperience = require("./../models/recruiter/recruiterExperienceModel");
const recruiterProfile = require("./../models/recruiter/recruiterProfileModel");
const recruiterCompany = require("./../models/recruiter/companyModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const factory = require("./controlMiddleware");
const AWS = require("aws-sdk");
const uuid = require("uuid").v4;

// ###############################
//     Middleware
// ###############################
const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

// ###############################
//     Recruiter Name
// ###############################
exports.getRecruiter = factory.getOne(Recruiter);
exports.getRecruiterEduExp = factory.getOne(Recruiter, [
  "education",
  "experience",
]);
exports.getRecruiterComJob = factory.getOne(Recruiter, ["company", "job"]);
exports.updateRecruiter = factory.updateOne(Recruiter);

// ###############################
//     Recruiter Experience
// ###############################
exports.getRecruiterExperience = factory.getOne(recruiterExperience);
exports.createRecruiterExperience = factory.createOne(recruiterExperience);
exports.updateRecruiterExperience = factory.updateOne(recruiterExperience);
exports.deleteRecruiterExperience = factory.deleteOne(recruiterExperience);
exports.getAllCompany = factory.getAll(recruiterCompany);

// ###############################
//     Recruiter Education
// ###############################
exports.getRecruiterEducation = factory.getOne(recruiterEducation);
exports.createRecruiterEducation = factory.createOne(recruiterEducation);
exports.updateRecruiterEducation = factory.updateOne(recruiterEducation);
exports.deleteRecruiterEducation = factory.deleteOne(recruiterEducation);

// ###############################
//     Delete recruiter account
// ###############################
exports.deleteMe = catchAsync(async (req, res, next) => {
  await Recruiter.findByIdAndUpdate(req.params.id, { active: false });

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
//   req.params.id = req.recruiter.id;
//   next();
// };
