const express = require('express');
const router = express.Router();
const wrapAsync = require("../Utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing} = require("../middleware.js");
const path = require('path');
const multer = require('multer');
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

const listingController = require("../controllers/listings.js");

router
  .route("/")
  .get(wrapAsync(listingController.index))
  .post(
    isLoggedIn,
    upload.array('listing[images]', 10),
    validateListing,
    wrapAsync(listingController.createListing)
  );

//wishlist route
router.delete('/wishlist/:id', 
  isLoggedIn, 
   wrapAsync(listingController.removeFromWishlist)
);

router.get("/wishlist", 
  isLoggedIn, 
  wrapAsync(listingController.renderwishlistform)
);

//New Route
router.get(
  "/new", 
  isLoggedIn, 
  listingController.renderNewform
);

// Delete images route
router.delete("/:id/deleteimages/:filename", 
  isLoggedIn, 
  isOwner, 
  wrapAsync(listingController.deleteImages)
);

// Show all images Route
router.get("/:id/Showimages",
  validateListing, 
  wrapAsync(listingController.showallimages)
);

//showroute, update route, delete listing route
router
  .route("/:id")
  .get(wrapAsync(listingController.showListing))
  .put(
    isLoggedIn,
    isOwner,
    upload.array('listing[images]', 10),  
    validateListing,
    wrapAsync(listingController.updateListing)
  )
  .delete(
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.destroyListing)
  );
//Edit Route
router.get("/:id/edit",
  isLoggedIn,
  isOwner,
  validateListing, 
  wrapAsync(listingController.renderEditForm)
);

// wishlist route
router.post("/:id/wishlist-toggle", 
  isLoggedIn, 
  listingController.wishlistToggle
);


module.exports = router;
