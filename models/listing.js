const mongoose = require("mongoose");
const review = require("./review"); // Assuming this is the Review model
const Schema = mongoose.Schema;
const Review = require("./review.js");
const { types, required } = require("joi");
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
    ],
    owner:{
        type : Schema.Types.ObjectId,
        ref: "User",
    },
    geometry: {
        type: {
            type: String, 
            enum: ['Point'], 
            required: true
        },
        coordinates: {
            type: [Number], 
            required: true
        }
    },
});

listingSchema.post("findOneAndDelete",async(Listing) =>{
    if(Listing ){
        await Review.deleteMany({_id : {$in: Listing.reviews}});
    }
})
module.exports = mongoose.model('Listing', listingSchema);

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;