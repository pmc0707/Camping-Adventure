const mongoose = require("mongoose");
// const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        filename: String,
        url: String,
    },
    price: {
        type: Number,
        required: true
    },
    country: String,
    location: String
});

module.exports = mongoose.model('Listing', listingSchema);

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;