const express = require("express");
const jobController = require("../controllers/jobController.js");
const authRecruiterController = require("./../controllers/authRecruiterController");

const router = express.Router();

router.get("/detail/:id", jobController.getJob);
router.get("/all/:recruiterID?", jobController.getJobs);

router.use(authRecruiterController.protect); // Protect all routes after this middleware

// #########     Recruiter Experience     #################
router
  .route("/detail/:id")
  .patch(jobController.updateJob)
  .delete(jobController.deleteJob);
router.post("/create-job", jobController.createJob);

// Get a list of applicants for a specific job posting
router.get("/:jobId/applicants", jobController.getJobApplicants);

module.exports = router;
