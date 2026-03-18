const Listing = require("../models/listing.js");
const User = require("../models/user.js")
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });
const {cloudinary} = require("../cloudConfig.js"); 

module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});

  let userWishlist = [];
  if (req.user) {
    const user = await User.findById(req.user._id).populate('wishlist');
    userWishlist = user.wishlist.map(listing => listing._id.toString());
  }

  res.render("listings/index.ejs", { 
    allListings,
    userWishlist,
    messages: req.flash() 
  });
}

module.exports.renderNewform = (req, res) => {
    res.render("listings/new.ejs");
}

module.exports.showListing =  async (req, res) => {
  let {id} = req.params;
  const listing = await Listing.findById(id)
  .populate({ path: "reviews",
    populate: {
      path: "author",
      model: "User"
    },
  })
    .populate("owner");
    if(!listing) {
      req.flash("error","Listing you requested for does not exist!!");
      return res.redirect("/listings");
    }

    let isWishlisted = false;
    if (req.user) {
      const user = await User.findById(req.user._id);
      isWishlisted = user.wishlist.includes(id);
    }


    //console.log(listing.reviews);
    res.render("listings/show.ejs",{listing,isWishlisted });
}

module.exports.showallimages = async (req ,res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);

  res.render("listings/showimages.ejs",{listing});
}

module.exports.createListing = async (req,res,next) => {
    let response = await geocodingClient
    .forwardGeocode({
        query: req.body.listing.location,
        limit: 1
    })
    .send();

    const newListing = new Listing(req.body.listing);

    newListing.images = req.files.map(file => ({
    url: file.path,
    filename: file.filename
    }));

    newListing.owner = req.user._id;

    newListing.geometry = response.body.features[0].geometry;

    await newListing.save();
    req.flash("success","Successfully created a new listing!!");
    res.redirect("/listings"); 
    // next();
}

module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing) {
      req.flash("error","Listing you requested for does not exist!!");
      return res.redirect("/listings");
    }

    const selectedImages = listing.images.slice(0, 2).map((img) => {
      return {
        url: img.url.replace("/upload", "/upload/w_250"),
      };
    });

    res.render("listings/edit.ejs", { listing, selectedImages });
}

module.exports.updateListing = async (req,res) => {
    let {id} = req.params;
    let listing = await Listing.findByIdAndUpdate(id,{...req.body.listing});

    // if (req.body.deleteImages) {
    // for (let filename of req.body.deleteImages) {
    //   await cloudinary.uploader.destroy(filename);
    // }
    // await listing.updateOne({
    //   $pull: { images: { filename: { $in: req.body.deleteImages } } }
    // });
    // }
    if (req.body.listing.location) {
    const geoData = await geocodingClient
      .forwardGeocode({
        query: req.body.listing.location,
        limit: 1,
      })
      .send();

    listing.geometry = geoData.body.features[0].geometry;
    }

    if (req.files && req.files.length > 0) {
      const imgs = req.files.map(file => ({
        url: file.path,
        filename: file.filename
      }));
      listing.images.push(...imgs); // Append to existing images
    }

    await listing.save();

    req.flash("success","Successfully updated the listing!!");
    res.redirect(`/listings/${id}`);
}

module.exports.destroyListing = async (req ,res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    //console.log(deletedListing);
    req.flash("success","Successfully deleted the listing!!");
    res.redirect("/listings");
  }

module.exports.deleteImages = async (req, res) => {
  const { id, filename } = req.params;
  const listing = await Listing.findById(id);

  if (!listing) {
    req.flash("error", "Listing not found!");
    return res.redirect("/listings");
  }

  if (listing.images.length <= 1) {
    req.flash("error","You must keep at least one image and first upload another images then delete the last image");
    return res.redirect(`/listings/${id}/Showimages`);
  }

  // Add folder prefix if not already present
  const fullFilename = filename.startsWith('wanderlust_DEV/') 
    ? filename 
    : `wanderlust_DEV/${filename}`;

  // Delete from Cloudinary
  await cloudinary.uploader.destroy(fullFilename);

  // Remove from database (match either with or without folder)
  await Listing.findByIdAndUpdate(id, {
    $pull: { 
      images: { 
        $or: [
          { filename: filename },
          { filename: fullFilename }
        ]
      } 
    }
  });

  req.flash("success", "Image deleted successfully!");
  res.redirect(`/listings/${id}/Showimages`);
};

// Wishlist Toggle - Simplified version
module.exports.wishlistToggle = async (req, res) => {
  try {
    const listingId = req.params.id;
    const user = req.user;

    // Check if listing exists
    const listing = await Listing.findById(listingId);
    if (!listing) {
      return res.status(404).json({ success: false, message: "Listing not found" });
    }

    // Toggle wishlist status
    const listingIndex = user.wishlist.indexOf(listingId);
    let isWishlisted = false;

    if (listingIndex === -1) {
      user.wishlist.push(listingId);
      isWishlisted = true;
    } else {
      user.wishlist.splice(listingIndex, 1);
    }

    await user.save();

    res.json({ 
      success: true, 
      isWishlisted,
        message: isWishlisted 
        ? "Added to your wishlist!" 
        : "Removed from your wishlist."
    });
  } catch (error) {
    console.error("Wishlist toggle error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }

};

// Render Wishlist Page
module.exports.renderwishlistform = async (req, res) => {
    const user = await User.findById(req.user._id).populate('wishlist');

    res.render("listings/wishlist.ejs", { 
      wishlist: user.wishlist,
      messages: req.flash() 
    });
};

module.exports.removeFromWishlist = async (req, res) => {
    const { id } = req.params;
    const userId = req.user._id;

    await User.findByIdAndUpdate(userId, {
      $pull: { wishlist: id }
    });

    res.json({ 
      success: true,
      message: 'Listing removed from your wishlist!',
      listingId: id
    });
};