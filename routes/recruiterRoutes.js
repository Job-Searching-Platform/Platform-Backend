const express = require("express");
const recruiterController = require("./../controllers/recruiterController");
const authRecruiterController = require("./../controllers/authRecruiterController");

const router = express.Router();

// #############################
//     Authentication
// #############################
router.post("/signup", authRecruiterController.signup);
router.post("/login", authRecruiterController.login);
router.get("/logout", authRecruiterController.logout);
router.post("/forgotPassword", authRecruiterController.forgotPassword);
router.patch("/resetPassword/:token", authRecruiterController.resetPassword);
router.post('/google-login', authRecruiterController.googleLogin);
router.post('/facebook-login', authRecruiterController.facebookLogin);
// #############################
//    Recruiter Account Info
// #############################
router.use(authRecruiterController.protect); // Protect all routes after this middleware

router.patch("/updateMyPassword", authRecruiterController.updatePassword);

// #########     Recruiter Name     #################
router
  .route("/me/:id")
  .get(recruiterController.getRecruiter)
  .patch(recruiterController.updateRecruiter);
router.delete("/deleteMe", recruiterController.deleteMe);

// #########     Recruiter Profile     #################
router
  .route("/myProfile/:id")
  .get(recruiterController.getRecruiterProfile)
  .patch(recruiterController.updateRecruiterProfile)
  .delete(recruiterController.deleteRecruiterProfile);
router.post("/myProfile", recruiterController.createRecruiterProfile);

// #########     Recruiter Experience     #################
router
  .route("/myExperience/:id")
  .get(recruiterController.getRecruiterExperience)
  .patch(recruiterController.updateRecruiterExperience)
  .delete(recruiterController.deleteRecruiterExperience);
router.post("/myExperience", recruiterController.createRecruiterExperience);
router.get("/myCompany", recruiterController.getAllCompany);

// #########     Recruiter Education     #################
router
  .route("/myEducation/:id")
  .get(recruiterController.getRecruiterEducation)
  .patch(recruiterController.updateRecruiterEducation)
  .delete(recruiterController.deleteRecruiterEducation);
router.post("/myEducation", recruiterController.createRecruiterEducation);

// #########     Recruiter Media & Resume     #################
router.get("/resumeUpload", recruiterController.resume_upload);
router.get("/mediaUpload", recruiterController.media_upload);

module.exports = router;
