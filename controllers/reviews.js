const Review = require("../models/review.js");
const Listing = require("../models/listing.js");

module.exports.createReview = async (req,res) => {
   // console.log(req.params.id);
  let listing = await Listing.findById(req.params.id);
  let newReview = new Review(req.body.review);
  newReview.author = req.user._id;
  //console.log(newReview);

  await newReview.save();
  listing.reviews.push(newReview._id);
  await listing.save();

  req.flash("success","Successfully created a new review!!");
  res.redirect(`/listings/${listing._id}`);
}

module.exports.renderEditForm = async (req,res) => {
    let { id, reviewId } = req.params;
    let listing = await Listing.findById(id).populate("reviews").populate({path: "reviews", populate: {path: "author"}});
    let review = await Review.findById(reviewId).populate("author");
    //console.log(review);
    if(!review){
        req.flash("error","Cannot find that review!!");
        return res.redirect(`/listings/${id}`);
    }
    res.render("reviews/edit.ejs", {listing, review});
}

module.exports.updateReview = async (req,res) => {
    let { id, reviewId } = req.params;
    let review = await Review.findByIdAndUpdate(reviewId, {...req.body.review});
    //console.log(review);
    await review.save();
    req.flash("success","Successfully updated the review!!"); 
    res.redirect(`/listings/${id}`);
}

module.exports.destroyReview = async (req,res) => {
    let { id, reviewId } = req.params;
  
    await Review.findByIdAndDelete(reviewId);
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
  
    req.flash("success","Successfully deleted the review!!");
    res.redirect(`/listings/${id}`);
  }