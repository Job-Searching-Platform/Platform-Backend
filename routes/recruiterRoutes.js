const express = require("express");
const recruiterController = require("./../controllers/recruiterController");
const authRecruiterController = require("./../controllers/authRecruiterController");

const router = express.Router();

// #########     Recruiter Authentication     #################
router.post("/signup", authRecruiterController.signup);
router.post("/login", authRecruiterController.login);
router.get("/logout", authRecruiterController.logout);
router.post("/forgotPassword", authRecruiterController.forgotPassword);
router.patch("/resetPassword/:token", authRecruiterController.resetPassword);
router.post("/google-login", authRecruiterController.googleLogin);
router.post("/facebook-login", authRecruiterController.facebookLogin);

router.use(authRecruiterController.protect); // Protect all routes after this middleware

router.patch("/updateMyPassword", authRecruiterController.updatePassword);

// #########    Recruiter Account Info    #################
router
  .route("/profile/:id")
  .get(recruiterController.getRecruiter)
  .patch(recruiterController.updateRecruiter);
router.delete("/deleteMe/:id", recruiterController.deleteRecruiter);

// #########    Bookmark Recruiter     #################
router
  .route("/bookmark/:jobID?/:candidateID")
  .delete(recruiterController.deleteBookmark)
  .post(recruiterController.createBookmark)
  .get(recruiterController.getBookmark);

// #########    Recruiter Job & Company    #################
router.get("/comjob/:id", recruiterController.getRecruiterComJob);
router.get("/myCompany", recruiterController.getAllCompany);

// #########     Recruiter Media & Resume     #################
router.get("/resume-upload/:path/:type", recruiterController.mediaUploader);

module.exports = router;
