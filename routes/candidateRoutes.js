const express = require("express");
const candidateController = require("../controllers/candidateController");
const authController = require("../controllers/authController");
// const chatController = require("./../controllers/chatController");

const router = express.Router();

router.get("/allcandidates", candidateController.getAllCandidates);

// #############################
//     Authentication
// #############################
router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.get("/logout", authController.logout);
router.post("/forgotPassword", authController.forgotPassword);
router.patch("/resetPassword/:token", authController.resetPassword);
router.post("/google-login", authController.googleLogin);
router.post("/facebook-login", authController.facebookLogin);

// #############################
//    Candidate Account Info
// #############################
router.use(authController.protect); // Protect all routes after this middleware

router.patch("/updateMyPassword", authController.updatePassword);

// #########     Candidate Name     #################
router
  .route("/myProfile/:id")
  .get(candidateController.getCandidate)
  .patch(candidateController.updateCandidate);
router.delete("/deleteMe/:id", candidateController.deleteMe);
router.get("/eduexp/:id", candidateController.getCandidateEduExp);

// #########    Bookmark Job     #################
router
  .route("/bookmark/:jobID?/:candidateID")
  .delete(candidateController.deleteBookmark)
  .post(candidateController.createBookmark)
  .get(candidateController.getBookmark);

// #########     Candidate Experience     #################
router
  .route("/myExperience/:id")
  .get(candidateController.getCandidateExperience)
  .patch(candidateController.updateCandidateExperience)
  .delete(candidateController.deleteCandidateExperience);
router.post("/myExperience", candidateController.createCandidateExperience);

// #########     Candidate Education     #################
router
  .route("/myEducation/:id")
  .get(candidateController.getCandidateEducation)
  .patch(candidateController.updateCandidateEducation)
  .delete(candidateController.deleteCandidateEducation);
router.post("/myEducation", candidateController.createCandidateEducation);

// #########     Candidate Media & Resume     #################
router.get("/resumeUpload", candidateController.resume_upload);
router.get("/mediaUpload", candidateController.media_upload);

// #############################
//        Candidate apply job
// ###############################
// Create a new application
router.post("/:jobID/apply/:candidateID", candidateController.applyJob);
// Get a list of applied jobs for the current candidate
router.get("/:candidateID/applied-jobs", candidateController.getAppliedJobs);

// #############################
//        Candidate Chat
// ###############################
// router.get("/:candidateID/:jobID/chat", chatController.getAllChats);
// router.patch("/:candidateID/:jobID/chat/:messageID", chatController.editChat);
// router.delete("/:candidateID/:jobID/chat/:messageID", chatController.deleteChat);
// router.post("/:candidateID/:jobID/chat", chatController.createChat);

module.exports = router;
