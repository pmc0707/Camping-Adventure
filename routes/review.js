const express = require("express");
const router = express.Router({mergeParams : true});
const { wrapAsync } = require('../utils/WrapAsync.js');
const ExpressError = require('../utils/ExpressError.js');

const Listing = require("../models/listing.js");
const {validateReview, isLoggedIn, isReviewAuthor} = require("../middelware.js")
const reviewController = require("../controller/review.js")

//REVIEW post route
router.post("/", isLoggedIn, validateReview, wrapAsync(reviewController.postReview))
//del review route
router.delete("/:reviewID",isReviewAuthor, wrapAsync(reviewController.destroyReview))

module.exports = router;