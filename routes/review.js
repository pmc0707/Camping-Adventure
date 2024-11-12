const express = require("express");
const router = express.Router({mergeParams : true});
const { wrapAsync } = require('../utils/WrapAsync.js');
const ExpressError = require('../utils/ExpressError.js');
const { reviewSchema} = require("../schema.js")
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
  
const validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
      let errMsg = error.details.map((el) => el.message).join(",");
      throw new ExpressError(404, errMsg);
    } else {
      next();
    }
  };

//REVIEW post route
router.post("/", validateReview, wrapAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id)
    let newReview = new Review(req.body.review);

    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    // res.send("new review saved")
    res.redirect(`/listings/${listing._id}`);
}))
//del review route
router.delete("/:reviewID", wrapAsync(async (req, res) => {
    let { id, reviewID } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewID } });
    await Review.findByIdAndDelete(reviewID);
    res.redirect(`/listings/${id}`);
}))

module.exports = router;