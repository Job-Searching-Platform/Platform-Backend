const express = require("express");
const companyController = require("./../controllers/copmanyController");
const authRecruiterController = require("./../controllers/authRecruiterController");

const router = express.Router();


// #########     Recruiter Profile     #################
router
  .route("/company/:id")
  .get(companyController.getCompany)
  .patch(companyController.updateCompany)
  .delete(companyController.deleteCompany);
router.post("/copmany", companyController.createCompany);

// #########     Recruiter Media & Resume     #################
router.get("/iconUpload", companyController.icon_upload);
router.get("/mediaUpload", companyController.media_upload);

module.exports = router;
