const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const { wrapAsync } = require('../utils/WrapAsync.js');
const Listing = require("../models/listing.js")
const {isLoggedIn, isOwner,validateListing} = require("../middelware.js")
const listingController = require("../controller/listing.js");

//index route
router.get("/", 
    wrapAsync(listingController.index));
//new route
router.get("/new",
     isLoggedIn,
     listingController.renderNewForm);
// show route
router.get(
    "/:id",
    wrapAsync(listingController.showListing))

//create route
router.post(
    "/", 
    isLoggedIn,
    validateListing,
    wrapAsync(listingController.createListing)
);
//edit route
router.get(
    "/:id/edit",
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.editListing)
);
//update route
router.put(
    "/:id",
    isLoggedIn,
    isOwner,
    validateListing,
    wrapAsync(listingController.updateListing));
//delete route
router.delete(
    "/:id",
    isLoggedIn, 
    isOwner,
    wrapAsync(listingController.deleteListing));

module.exports = router;