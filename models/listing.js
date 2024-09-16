const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image:{
        filename:{
            type:String,
            required:true,
        },
        url:{
            type:String,
            required:true,
            set:function(v){
                return v==="https://unsplash.com/photos/a-road-surrounded-by-purple-trees-with-a-sky-in-the-background-Fp7NoYkmowk"?"":v;
            },

        }
    },
    price: Number,
  location: String,
  country: String,

});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;