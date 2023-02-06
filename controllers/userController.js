const User = require("./../models/user/userModel");
const userEducation = require("../models/user/userEducationModel");
const userExperience = require("./../models/user/userExperienceModel");
const userProfile = require("./../models/user/userProfileModel");
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
//     User Name
// ###############################
exports.getUser = factory.getOne(User);
exports.getUserEduExp = factory.getOne(User, ["education", "experience"]);
exports.updateUser = factory.updateOne(User);

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

// ###############################
//     Delete user account
// ###############################
exports.deleteMe = catchAsync(async (req, res, next) => {
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
