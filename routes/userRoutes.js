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
router.post('/google-login', authController.googleLogin);
router.post('/facebook-login', authController.facebookLogin);

// #############################
//    User Account Info
// #############################
router.use(authController.protect); // Protect all routes after this middleware

router.patch("/updateMyPassword", authController.updatePassword);

// #########     User Name     #################
router
  .route("/me/:id")
  .get(userController.getUser)
  .patch(userController.updateUser);
router.delete("/deleteMe", userController.deleteMe);

// #########     User Profile     #################
router
  .route("/myProfile/:id")
  .get(userController.getUserProfile)
  .patch(userController.updateUserProfile)
  .delete(userController.deleteUserProfile);
router.post("/myProfile", userController.createUserProfile);

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

module.exports = router;
