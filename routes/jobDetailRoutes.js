const express = require("express");
const jobController = require("../controllers/jobController.js");
const authRecruiterController = require("./../controllers/authRecruiterController");

const router = express.Router();


router.get("/job/:id", jobController.getJob);

router.use(authRecruiterController.protect); // Protect all routes after this middleware


// #########     Recruiter Experience     #################
router
  .route("/job/:id")
  .get(jobController.getJob)
  .patch(jobController.updateJob)
  .delete(jobController.deleteJob);
router.post("/create-job", jobController.createJob);

module.exports = router;
