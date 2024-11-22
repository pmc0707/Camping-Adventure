const express = require("express");
const router = express.Router({mergeParams : true});
const { wrapAsync } = require('../utils/WrapAsync.js');
const ExpressError = require('../utils/ExpressError.js');
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const {validateReview, isLoggedIn, isReviewAuthor} = require("../middelware.js")


//REVIEW post route
router.post("/", isLoggedIn, validateReview, wrapAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id)
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success","Review Added!")
    res.redirect(`/listings/${listing._id}`);
}))
//del review route
router.delete("/:reviewID",isReviewAuthor, wrapAsync(async (req, res) => {
    let { id, reviewID } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewID } });
    await Review.findByIdAndDelete(reviewID);
    req.flash("success"," Review Deleted!")
    res.redirect(`/listings/${id}`);
}))

module.exports = router;