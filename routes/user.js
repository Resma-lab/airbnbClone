const express = require("express");
const wrapAsync = require("../Utils/wrapAsync");
const router = express.Router();
const User = require("../models/user.js");
const passport = require("passport");
const { saveRedirectUrl, isLoggedIn } = require("../middleware.js");
const multer = require('multer');
const { storage } = require('../cloudConfig'); // Your cloudinary config
const upload = multer({ storage });

const userController = require("../controllers/users.js");
const user = require("../models/user.js");

router
  .route("/signup")
    .get( userController.renderSignupForm)
    .post(wrapAsync(userController.signup));
  
router
  .route("/login")
  .get(userController.renderLoginForm)
  .post(
    saveRedirectUrl,
    passport.authenticate( "local",{
      failureRedirect: "/login",
      failureFlash: true,
      keepSessionInfo: true
    }),
    userController.login,
  );

router.get("/logout", 
  userController.logout,
);

// Add profile routes
// router.get("/profile", 
//   userController.renderProfileform,
// );

// router.post("/profile/remove-picture", 
//   isLoggedIn,
//   userController.removeProfilePicture
// );

// router.post("/profile/upload", 
//   isLoggedIn,
//   upload.single('profilePicture'),
//   userController.uploadProfilePicture
// );

// router.post("/profile/update", 
//   isLoggedIn,
//   userController.updateProfile
// );


// Profile routes
router.get("/profile", 
  wrapAsync(userController.renderProfileform)
);

router.post("/profile/upload", 
  upload.single('profilePicture'),
  wrapAsync(userController.uploadProfilePicture)
);

router.post("/profile/update", 
  wrapAsync(userController.updateProfile)
);

router.post("/profile/remove-picture", 
  wrapAsync(userController.removeProfilePicture)
);

module.exports = router;