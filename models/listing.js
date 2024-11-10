const mongoose = require("mongoose");
const review = require("./review"); // Assuming this is the Review model
const Schema = mongoose.Schema;

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
    location: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review",
        }
    ]
});

// module.exports = mongoose.model("Listing", listingSchema);


module.exports = mongoose.model('Listing', listingSchema);

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;