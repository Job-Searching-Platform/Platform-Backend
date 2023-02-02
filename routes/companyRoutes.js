const express = require("express");
const companyController = require("./../controllers/copmanyController");
const authRecruiterController = require("./../controllers/authRecruiterController");

const router = express.Router();

router.get("/detail/:id", companyController.getCompany);

router.use(authRecruiterController.protect); // Protect all routes after this middleware

// #########     Recruiter Profile     #################
router
  .route("/detail/:id")
  .patch(companyController.updateCompany)
  .delete(companyController.deleteCompany);
router.post("/create-company", companyController.createCompany);

// #########     Recruiter Media & Resume     #################
router.get("/iconUpload", companyController.icon_upload);
router.get("/mediaUpload", companyController.media_upload);

module.exports = router;
