const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const APIFeatures = require("./../utils/API-features");

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

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);

    res.status(201).json({
      status: "success",
      doc,
    });
  });

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

exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    // To allow for nested GET reviews on tour (hack)
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId };

    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    // const doc = await features.query.explain();
    const doc = await features.query;

    // SEND RESPONSE
    res.status(200).json({
      status: "success",
      results: doc.length,
      doc,
    });
  });

exports.createBookmark = (personModel, jobModel, path) =>
  catchAsync(async (req, res) => {
    const doc = await personModel.findById(req.user._id);
    const job = await jobModel.findById(req.params.id);
    if (path === "user") {
      const isBookmarked = doc.bookmarkedJobs.includes(job._id);
      if (isBookmarked) {
        doc.bookmarkedJobs = doc.bookmarkedJobs.filter((j) => j !== job._id);
      } else {
        doc.bookmarkedJobs.push(job._id);
      }
    } else {
      const isBookmarked = doc.bookmarkedCandidates.includes(job._id);
      if (isBookmarked) {
        doc.bookmarkedCandidates = doc.bookmarkedCandidates.filter(
          (j) => j !== job._id
        );
      } else {
        doc.bookmarkedCandidates.push(job._id);
      }
    }
    await doc.save();

    res.status(201).json({
      status: "success",
      doc,
    });
  });
exports.deleteBookmark = (personModel, path) =>
  catchAsync(async (req, res) => {
    const doc = await personModel.findById(req.user._id);
    if (path === "user") {
      doc.bookmarkedJobs = doc.bookmarkedJobs.filter(
        (j) => j !== req.params.id
      );
    } else {
      doc.bookmarkedCandidates = doc.bookmarkedCandidates.filter(
        (j) => j !== req.params.id
      );
    }
    await doc.save();

    res.status(201).json({
      status: "success",
      doc,
    });
  });

exports.getBookmark = (personModel, popOptions) =>
  catchAsync(async (req, res) => {
    let query = await personModel.findById(req.user._id);
    if (popOptions) query = query.populate(popOptions);
    const doc = await query;

    res.status(201).json({
      status: "success",
      doc,
    });
  });
