const AWS = require("aws-sdk");
const catchAsync = require("./../utils/catchAsync");
const uuid = require("uuid").v4;

exports.aws_uploader = catchAsync(async (req, res) => {
  const accessKeyId = `${process.env.AccessKeyID}`;
  const secretAccessKey = `${process.env.SecretAccessKey}`;

  const s3 = new AWS.S3({
    accessKeyId,
    secretAccessKey,
    region: "ap-south-1",
    apiVersion: "2010-12-01",
    signatureVersion: "v4",
  });

  const key = `${req.params.path}/${uuid()}.${req.params.type}`;
  const conType = req.params.type === "pdf" ? "application/pdf" : "image/jpeg";
  s3.getSignedUrl(
    "putObject",
    {
      Bucket: "job-searching-platform",
      ContentType: conType,
      Key: key,
      Expires: 1000,
    },
    (err, url) => res.send({ key, url })
  );
});
