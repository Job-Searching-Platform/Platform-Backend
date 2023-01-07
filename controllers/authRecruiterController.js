const crypto = require("crypto");
const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const Recruiter = require("../models/recruiter/recruiterModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const Email = require("../utils/email");
const axios = require("axios");



// ##########################
//        JWT creators
// ##########################
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};
const createSendToken = (recruiter, statusCode, req, res) => {
  const token = signToken(recruiter._id);

  res.cookie("jwt", token, {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: req.secure || req.headers["x-forwarded-proto"] === "https",
  });

  // Remove password from output
  recruiter.password = undefined;

  res.status(statusCode).json({
    status: "success",
    token,
    recruiter,
  });
};




// ##########################
//        Sign Up
// ##########################

exports.signup = catchAsync(async (req, res, next) => {
  const newRecruiter = await Recruiter.create({
    fullName: req.body.fullName,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  // const url = `${req.protocol}://${req.get("host")}/me`;
  // await new Email(newRecruiter, url).sendWelcome();

  createSendToken(newRecruiter, 201, req, res);
});



// ##########################
//        Sign In
// ##########################
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1) Check if email and password exist
  if (!email || !password) {
    return next(new AppError("Please provide email and password!", 400));
  }
  // 2) Check if recruiter exists && password is correct
  const recruiter = await Recruiter.findOne({ email }).select("+password");

  if (!recruiter || !(await recruiter.correctPassword(password, recruiter.password))) {
    return next(new AppError("Incorrect email or password", 401));
  }

  // 3) If everything ok, send token to client
  createSendToken(recruiter, 200, req, res);
});


// ##########################
//        Sign Out
// ##########################
exports.logout = (req, res) => {
  res.cookie("jwt", "loggedout", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ status: "success" });
};



// ##########################
//      Signed In Checker
// ##########################
exports.protect = catchAsync(async (req, res, next) => {
  // 1) Getting token and check of it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(
      new AppError("You are not logged in! Please log in to get access.", 401)
    );
  }

  // 2) Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3) Check if recruiter still exists
  const currentRecruiter = await Recruiter.findById(decoded.id);
  if (!currentRecruiter) {
    return next(
      new AppError(
        "The recruiter belonging to this token does no longer exist.",
        401
      )
    );
  }

  // 4) Check if recruiter changed password after the token was issued
  if (currentRecruiter.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError("Recruiter recently changed password! Please log in again.", 401)
    );
  }

  // GRANT ACCESS TO PROTECTED ROUTE
  req.recruiter = currentRecruiter;
  res.locals.recruiter = currentRecruiter;
  next();
});



// ##################################
//       Authenticated Checker
// ###################################
// Only for rendered pages, no errors!
exports.isLoggedIn = async (req, res, next) => {
  if (req.cookies.jwt) {
    try {
      // 1) verify token
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET
      );

      // 2) Check if recruiter still exists
      const currentRecruiter = await Recruiter.findById(decoded.id);
      if (!currentRecruiter) {
        return next();
      }

      // 3) Check if recruiter changed password after the token was issued
      if (currentRecruiter.changedPasswordAfter(decoded.iat)) {
        return next();
      }

      // THERE IS A LOGGED IN USER
      res.locals.recruiter = currentRecruiter;
      return next();
    } catch (err) {
      return next();
    }
  }
  next();
};


// ##################################
//       Restriction Checker
// ###################################
// exports.restrictTo = (...roles) => {
//   return (req, res, next) => {
//     // roles ['admin', 'lead-guide']. role='recruiter'
//     if (!roles.includes(req.recruiter.role)) {
//       return next(
//         new AppError("You do not have permission to perform this action", 403)
//       );
//     }

//     next();
//   };
// };



// ##################################
//       Forgot Password
// ###################################
exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1) Get recruiter based on POSTed email
  const recruiter = await Recruiter.findOne({ email: req.body.email });
  if (!recruiter) {
    return next(new AppError("There is no recruiter with email address.", 404));
  }

  // 2) Generate the random reset token
  const resetToken = recruiter.createPasswordResetToken();
  await recruiter.save({ validateBeforeSave: false });

  // 3) Send it to recruiter's email
  try {
    const resetURL = `${req.protocol}://${req.get(
      "host"
    )}/recruiters/resetPassword/${resetToken}`;
    await new Email(recruiter, resetURL).sendPasswordReset();

    res.status(200).json({
      status: "success",
      message: "Token sent to email!",
    });
  } catch (err) {
    recruiter.passwordResetToken = undefined;
    recruiter.passwordResetExpires = undefined;
    await recruiter.save({ validateBeforeSave: false });

    return next(
      new AppError("There was an error sending the email. Try again later!"),
      500
    );
  }
});



// ##################################
//       Reset Password
// ###################################
exports.resetPassword = catchAsync(async (req, res, next) => {
  // 1) Get recruiter based on the token
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const recruiter = await Recruiter.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  // 2) If token has not expired, and there is recruiter, set the new password
  if (!recruiter) {
    return next(new AppError("Token is invalid or has expired", 400));
  }
  recruiter.password = req.body.password;
  recruiter.passwordConfirm = req.body.passwordConfirm;
  recruiter.passwordResetToken = undefined;
  recruiter.passwordResetExpires = undefined;
  await recruiter.save();

  // 3) Update changedPasswordAt property for the recruiter
  // 4) Log the recruiter in, send JWT
  createSendToken(recruiter, 200, req, res);
});



// ##################################
//       Update Password
// ###################################
exports.updatePassword = catchAsync(async (req, res, next) => {
  // 1) Get recruiter from collection
  const recruiter = await Recruiter.findById(req.recruiter.id).select("+password");

  // 2) Check if POSTed current password is correct
  if (!(await recruiter.correctPassword(req.body.passwordCurrent, recruiter.password))) {
    return next(new AppError("Your current password is wrong.", 401));
  }

  // 3) If so, update password
  recruiter.password = req.body.password;
  recruiter.passwordConfirm = req.body.passwordConfirm;
  await recruiter.save();
  // Recruiter.findByIdAndUpdate will NOT work as intended!

  // 4) Log recruiter in, send JWT
  createSendToken(recruiter, 200, req, res);
});




// ##################################
//       GOOGLE OAuth
// ###################################
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
exports.googleLogin = (req, res) => {
  const { idToken } = req.body;

  client
    .verifyIdToken({ idToken, audience: process.env.GOOGLE_CLIENT_ID })
    .then((response) => {
      // console.log('GOOGLE LOGIN RESPONSE',response)
      const { email_verified, name, email } = response.payload;
      if (email_verified) {
        Recruiter.findOne({ email }).exec((err, recruiter) => {
          if (recruiter) {
            const token = jwt.sign({ _id: recruiter._id }, process.env.JWT_SECRET, {
              expiresIn: "7d",
            });
            const { _id, email, name, role } = recruiter;
            return res.json({
              token,
              recruiter: { _id, email, name, role },
            });
          } else {
            let password = email + process.env.JWT_SECRET;
            recruiter = new Recruiter({ name, email, password });
            recruiter.save((err, data) => {
              if (err) {
                console.log("ERROR GOOGLE LOGIN ON USER SAVE", err);
                return res.status(400).json({
                  error: "Recruiter signup failed with google",
                });
              }
              const token = jwt.sign(
                { _id: data._id },
                process.env.JWT_SECRET,
                { expiresIn: "7d" }
              );
              const { _id, email, name, role } = data;
              return res.json({
                token,
                recruiter: { _id, email, name, role },
              });
            });
          }
        });
      } else {
        return res.status(400).json({
          error: "Google login failed. Try again",
        });
      }
    });
};



// ##################################
//       FACEBOOK OAuth
// ###################################
exports.facebookLogin = (req, res) => {
  console.log("FACEBOOK LOGIN REQ BODY", req.body);
  const { recruiterID, accessToken } = req.body;

  const url = `https://graph.facebook.com/v2.11/${recruiterID}/?fields=id,name,email&access_token=${accessToken}`;

  return (
    axios(url, {
      method: "GET",
    })
      .then((response) => response.json())
      // .then(response => console.log(response))
      .then((response) => {
        const { email, name } = response;
        Recruiter.findOne({ email }).exec((err, recruiter) => {
          if (recruiter) {
            const token = jwt.sign({ _id: recruiter._id }, process.env.JWT_SECRET, {
              expiresIn: "7d",
            });
            const { _id, email, name, role } = recruiter;
            return res.json({
              token,
              recruiter: { _id, email, name, role },
            });
          } else {
            let password = email + process.env.JWT_SECRET;
            recruiter = new Recruiter({ name, email, password });
            recruiter.save((err, data) => {
              if (err) {
                console.log("ERROR FACEBOOK LOGIN ON USER SAVE", err);
                return res.status(400).json({
                  error: "Recruiter signup failed with facebook",
                });
              }
              const token = jwt.sign(
                { _id: data._id },
                process.env.JWT_SECRET,
                { expiresIn: "7d" }
              );
              const { _id, email, name, role } = data;
              return res.json({
                token,
                recruiter: { _id, email, name, role },
              });
            });
          }
        });
      })
      .catch((error) => {
        res.json({
          error: "Facebook login failed. Try later",
        });
      })
  );
};

