const express = require('express');
const router = express.Router({mergeParams: true});
const wrapAsync = require("../Utils/wrapAsync.js");
const ExpressError = require("../Utils/ExpressError.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware.js");

const reviewController = require("../controllers/reviews.js");

//Reviews
//Post Route
router.post("/",
  isLoggedIn, 
  validateReview, 
  wrapAsync(reviewController.createReview)
);

//edit Route for Reviews
router.get("/:reviewId/edit",
  isLoggedIn, 
  isReviewAuthor,
  wrapAsync(reviewController.renderEditForm)
);

//update Route for Reviews
router.put("/:reviewId",
  isLoggedIn, 
  isReviewAuthor,
  validateReview,
  wrapAsync(reviewController.updateReview)
);

//Delete Route for Reviews
router.delete("/:reviewId",
  isLoggedIn, 
  isReviewAuthor,
  wrapAsync(reviewController.destroyReview)
);

module.exports = router;