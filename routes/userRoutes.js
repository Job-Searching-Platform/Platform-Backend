const express = require("express");
const userController = require("./../controllers/userController");
const authController = require("./../controllers/authController");

const router = express.Router();

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

router.post("/:id/apply", userController.applyJob);
// #############################
//    User Account Info
// #############################
router.use(authController.protect); // Protect all routes after this middleware

router.patch("/updateMyPassword", authController.updatePassword);

// #########     User Name     #################
router
  .route("/myProfile/:id")
  .get(userController.getUser)
  .patch(userController.updateUser);
router.delete("/deleteMe/:id", userController.deleteMe);
router.get("/eduexp/:id", userController.getUserEduExp);

// #########    Bookmark Job     #################
router
  .route("/bookmark/:id")
  .delete(userController.deleteBookmark)
  .post(userController.createBookmark);
router.get("/bookmarked", userController.getBookmark);

// #########     User Experience     #################
router
  .route("/myExperience/:id")
  .get(userController.getUserExperience)
  .patch(userController.updateUserExperience)
  .delete(userController.deleteUserExperience);
router.post("/myExperience", userController.createUserExperience);

// #########     User Education     #################
router
  .route("/myEducation/:id")
  .get(userController.getUserEducation)
  .patch(userController.updateUserEducation)
  .delete(userController.deleteUserEducation);
router.post("/myEducation", userController.createUserEducation);

// #########     User Media & Resume     #################
router.get("/resumeUpload", userController.resume_upload);
router.get("/mediaUpload", userController.media_upload);

// Create a new application

// Get a list of applied jobs for the current candidate
router.get("/applied-jobs", userController.getAppliedJobs);

module.exports = router;
