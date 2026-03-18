const User = require("../models/user.js");
const { cloudinary } = require("../cloudConfig.js");

module.exports.renderSignupForm = (req, res) => {
    res.render("users/signup.ejs");
};

module.exports.signup = async (req, res) => {
  try {
    let { username, email, password } = req.body;
    let newUser = new User({ username, email });
    const registeredUser = await User.register(newUser, password);
    console.log(registeredUser);
    req.login(registeredUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "Welcome to Wanderlust!");
      res.redirect("/listings");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/signup");
  }
};

module.exports.renderLoginForm = (req, res) => {
    res.render("users/login.ejs");
};

module.exports.login = async (req, res) => {
    req.flash("success", "Welcome back to Wanderlust!");
    res.redirect(res.locals.redirectUrl || "/listings");
};

module.exports.logout = (req, res) => {
    req.logout((err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "You have logged out successfully!");
      res.redirect("/listings");
    });
};

// Add profile to your users controller
module.exports.renderProfileform = async (req, res) => {
    if (!req.user) {
        req.flash("error", "You need to login first");
        return res.redirect("/login");
    }
    
    const user = await User.findById(req.user._id);
    if (!user) {
        req.flash("error", "User not found");
        return res.redirect("/listings");
    }
  
    res.render("users/profile.ejs", { currentUser: user });
};

module.exports.uploadProfilePicture = async (req, res) => {
    const { file } = req;
    const user = await User.findById(req.user._id);
    
    if (file) {
        user.profilePicture = {
            url: file.path,
            filename: file.filename
        };
        await user.save();
        req.flash("success", "Profile picture updated successfully!");
    } else {
        req.flash("error", "No file selected");
    }
    
    res.redirect("/profile");
};

module.exports.updateProfile = async (req, res) => {
    const { username, email } = req.body;
    const user = await User.findByIdAndUpdate(
        req.user._id,
        { username, email },
        { new: true }
    );
    await user.save();
    
    req.flash("success", "Profile updated successfully!");
    res.redirect("/profile");
};

module.exports.removeProfilePicture = async (req, res) => {
    // 1. Verify authentication
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "You must be logged in",
      });
    }

    // 2. Find user in database
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // 3. Check if profile picture exists
    if (!user.profilePicture || !user.profilePicture.filename) {
      return res.status(400).json({
        success: false,
        message: "No profile picture to remove",
      });
    }

    // 4. Prepare Cloudinary filename
    const filename = user.profilePicture.filename;
    const fullFilename = filename.startsWith('wanderlust_DEV/') 
      ? filename 
      : `wanderlust_DEV/${filename}`;

    console.log('Attempting to delete from Cloudinary:', fullFilename);

    // 5. Delete from Cloudinary with error handling
    let cloudinaryResult;
    try {
      cloudinaryResult = await cloudinary.uploader.destroy(fullFilename, {
        resource_type: 'image',
        invalidate: true
      });
      console.log('Cloudinary deletion result:', cloudinaryResult);
    } catch (cloudinaryError) {
      console.error('Cloudinary deletion error:', cloudinaryError);
      // Continue with database update even if Cloudinary fails
    }

    // 6. Update database
    user.profilePicture = undefined;
    await user.save();

    // 7. Return success response
    return res.status(200).json({
      success: true,
      message: "Profile picture removed successfully",
      user: {
        username: user.username,
        hasProfilePicture: false
      },
      cloudinaryResult: cloudinaryResult?.result
    });
};