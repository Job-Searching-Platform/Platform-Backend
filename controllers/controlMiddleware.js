const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const APIFeatures = require("./../utils/API-features");
const AWS = require("aws-sdk");
const uuid = require("uuid").v4;

// ###############################################
//             Delete Signle Document
// ###############################################
exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(new AppError("No document found with that ID", 404));
    }

    res.status(204).json({
      status: "success",
      data: req.params.id,
    });
  });

// ###############################
//     DELETE candidate account
// ###############################
exports.deleteMe = (Model) =>
  catchAsync(async (req, res, next) => {
    await Model.findByIdAndUpdate(req.params.id, { active: false });

    res.status(204).json({
      status: "success",
      data: null,
    });
  });

// ###############################################
//             PATCH Signle Document
// ###############################################
exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!doc) {
      return next(new AppError("No document found with that ID", 404));
    }

    res.status(200).json({
      status: "success",
      doc,
    });
  });

// ###############################################
//             CREATE Signle Document
// ###############################################
exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);

    res.status(201).json({
      status: "success",
      doc,
    });
  });

// ###############################################
//             GET Signle Document
// ###############################################
exports.getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (popOptions) query = query.populate(popOptions);
    const doc = await query;

    if (!doc) {
      return next(new AppError("No document found with that ID", 404));
    }

    res.status(200).json({
      status: "success",
      doc,
    });
  });

// ###############################################
//             GET All Document
// ###############################################
exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    // To allow for nested GET reviews on tour (hack)
    const counter = await Model.find().limit(1).count();
    if (counter > 0) {
      let filter = {};

      if (req.params.recruiterID)
        filter = { recruiter: req.params.recruiterID };

      const features = new APIFeatures(
        Model.find(filter),
        Model,
        req.query,
        filter
      )
        .filter()
        .limitFields()
        .sort()
        .paginate();
      const doc = await features.query;

      let totalPages = null;
      if (req.query.page !== "null") {
        const total = await Model.countDocuments({});
        totalPages = Math.ceil(total / req.query.limit);
      }

      // SEND RESPONSE
      res.status(200).json({
        status: "success",
        totalPages,
        doc,
      });
    } else {
      return next(new AppError("No document found with this query", 404));
    }
  });

// ###############################################
//             AWS for Resume upload
// ###############################################
exports.createBookmark = (personModel, jobModel, path) =>
  catchAsync(async (req, res) => {
    const doc = await personModel.findById(req.params.candidateID);
    const job = await jobModel.findById(req.params.jobID);
    if (path === "candidate") {
      const isBookmarked = doc.bookmarkedJobs.includes(job._id);
      if (isBookmarked) {
        doc.bookmarkedJobs = doc.bookmarkedJobs.filter((j) => j !== job._id);
      } else {
        doc.bookmarkedJobs.push(job._id);
      }
    } else {
      console.log(req.params);
      console.log(doc.bookmarkedCandidates);
      const isBookmarked = doc.bookmarkedCandidates.includes(job._id);
      if (isBookmarked) {
        doc.bookmarkedCandidates = doc.bookmarkedCandidates.filter(
          (j) => j !== job._id
        );
      } else {
        doc.bookmarkedCandidates.push(job._id);
      }
    }
    console.log(doc.bookmarkedCandidates);
    await doc.save();
    console.log(doc.bookmarkedCandidates);

    res.status(201).json({
      status: "success",
      doc,
    });
  });

// ###############################################
//             AWS for Resume upload
// ###############################################
exports.deleteBookmark = (personModel, path) =>
  catchAsync(async (req, res) => {
    const doc = await personModel.findById(req.params.candidateID);
    if (path === "candidate") {
      doc.bookmarkedJobs = doc.bookmarkedJobs.filter(
        (j) => j !== req.params.jobID
      );
    } else {
      doc.bookmarkedCandidates = doc.bookmarkedCandidates.filter(
        (j) => j !== req.params.jobID
      );
    }
    await doc.save();

    res.status(201).json({
      status: "success",
      doc,
    });
  });

// ###############################################
//             AWS for Resume upload
// ###############################################
exports.getBookmark = (personModel, popOptions) =>
  catchAsync(async (req, res) => {
    let query = await personModel.findById(req.params.candidateID);
    if (popOptions) query = query.populate(popOptions);
    const doc = await query;

    res.status(201).json({
      status: "success",
      doc,
    });
  });

// ###############################################
//             AWS for Resume upload
// ###############################################
exports.resumeUpload = () =>
  catchAsync(async (req, res, next) => {
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
//     AWS for Media upload
// ###############################
exports.mediaUpload = () =>
  catchAsync(async (req, res, next) => {
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
//     AWS for Media upload
// ###############################
exports.mediaUploader = () =>
  catchAsync(async (req, res, next) => {
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
    const conType =
      req.params.type === "pdf" ? "application/pdf" : "image/jpeg";
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
