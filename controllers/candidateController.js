const Candidate = require("../models/candidate/candidateModel");
const Job = require("../models/job_company/jobModel");
const Application = require("../models/candidate/jobApplicationModel");
const catchAsync = require("../utils/catchAsync");
const factory = require("./controlMiddleware");

// ###############################
//     Candidate Profile Info
// ###############################
exports.getCandidate = factory.getOne(Candidate);
exports.getAllCandidates = factory.getAll(Candidate);
exports.deleteCandidate = factory.deleteMe(Candidate);
exports.updateCandidate = factory.updateOne(Candidate);

// ####################################################
//           Bookmark Job
// ####################################################
exports.createBookmark = factory.createBookmark(Candidate, Job, "candidate");
exports.deleteBookmark = factory.deleteBookmark(Candidate, "candidate");
exports.getBookmark = factory.getBookmark(Candidate, "bookmarkedJobs");

// #############################################
//     AWS for Resume & Media upload
// #############################################
exports.mediaUploader = factory.mediaUploader();

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
