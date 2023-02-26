const express = require("express");
const uploadController = require("./../controllers/uploadController");
const authController = require("./../controllers/authController");

const router = express.Router();

router.use(authController.protect);

// #########     upload route    #################
router.get("/:path/:type", uploadController.aws_uploader);

module.exports = router;
