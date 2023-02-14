const recruiterCompany = require("./../models/recruiter/companyModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const factory = require("./controlMiddleware");
const AWS = require("aws-sdk");
const uuid = require("uuid").v4;

// ###############################
//     Recruiter Education
// ###############################
exports.getCompany = factory.getOne(recruiterCompany, "job");
exports.getCompannies = factory.getAll(recruiterCompany);
exports.createCompany = factory.createOne(recruiterCompany);
exports.updateCompany = factory.updateOne(recruiterCompany);
exports.deleteCompany = factory.deleteOne(recruiterCompany);

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
