const Recruiter = require("./../models/recruiter/recruiterModel");
const Candidate = require("./../models/candidate/candidateModel");
const recruiterCompany = require("./../models/job_company/companyModel");
const factory = require("./controlMiddleware");

// ###############################
//     Recruiter Name
// ###############################
exports.getRecruiter = factory.getOne(Recruiter);
exports.deleteRecruiter = factory.deleteMe(Recruiter);
exports.updateRecruiter = factory.updateOne(Recruiter);

//  ##################################
//            Bookmark
//  ##################################
exports.createBookmark = factory.createBookmark(
  Recruiter,
  Candidate,
  "recruiter"
);
exports.deleteBookmark = factory.deleteBookmark(Recruiter, "recruiter");
exports.getBookmark = factory.getBookmark(Recruiter, "bookmarkedCandidates");

// ###############################
//     Recruiter Experience
// ###############################
exports.getAllCompany = factory.getAll(recruiterCompany);
exports.getRecruiterComJob = factory.getOne(Recruiter, ["company"]);

// #############################################
//     AWS for Resume & Media upload
// #############################################
exports.mediaUploader = factory.mediaUploader();
