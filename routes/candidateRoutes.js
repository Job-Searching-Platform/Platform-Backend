const express = require("express");
const candidateController = require("../controllers/candidateController");
const authController = require("../controllers/authController");
// const chatController = require("./../controllers/chatController");

const router = express.Router();

// #########     Authentication     #################
router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.get("/logout", authController.logout);
router.post("/forgotPassword", authController.forgotPassword);
router.patch("/resetPassword/:token", authController.resetPassword);
router.post("/google-login", authController.googleLogin);
router.post("/facebook-login", authController.facebookLogin);

router.use(authController.protect); // Protect all routes after this middleware
router.patch("/updateMyPassword", authController.updatePassword);

// #########     Candidate Account Info     #################
router
  .route("/profile/:id")
  .get(candidateController.getCandidate)
  .patch(candidateController.updateCandidate);
router.delete("/deleteMe/:id", candidateController.deleteCandidate);

// #########    Bookmark Job     #################
router
  .route("/bookmark/:jobID?/:candidateID")
  .delete(candidateController.deleteBookmark)
  .post(candidateController.createBookmark)
  .get(candidateController.getBookmark);
router.get("/allcandidates", candidateController.getAllCandidates);

// #########     Candidate Media & Resume     #################
router.get("/resume-upload/:path/:type", candidateController.mediaUploader);

// #########     Candidate Job Application     #################
router.post("/:jobID/apply/:candidateID", candidateController.applyJob);
router.get("/:candidateID/applied-jobs", candidateController.getAppliedJobs);

// #########     Candidate Chat     #################
// router.get("/:candidateID/:jobID/chat", chatController.getAllChats);
// router.patch("/:candidateID/:jobID/chat/:messageID", chatController.editChat);
// router.delete("/:candidateID/:jobID/chat/:messageID", chatController.deleteChat);
// router.post("/:candidateID/:jobID/chat", chatController.createChat);

module.exports = router;
