const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
 image: {
        url: {
            type: String,
            required: true // Ensure this is required if you want validation
        },
        filename: {
            type: String,
            required: true // Ensure this is required if you want validation
        }
    },
    price: Number,
  location: String,
  country: String,

});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;