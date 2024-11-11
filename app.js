const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js")
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const path = require("path")
const methodOverride = require("method-override")
const ejsMate = require("ejs-mate");
const { wrapAsync } = require('./utils/WrapAsync.js');
const ExpressError = require('./utils/ExpressError.js')
const {listingSchema, reviewSchema} = require("./schema.js")
const Review = require("./models/review.js")
const listings = require("./routes/listing.js")
main().then(()=>{
    console.log("db is connected")
}).catch((err)=>{
    console.log(err);
})
async  function main() {
    await mongoose.connect(MONGO_URL)
}
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"))
app.use(express.urlencoded({extended: true}))
app.use(methodOverride("_method"))
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

app.get("/", (req, res) => {
    res.send("Hi, I am root");
  });
  
  const validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
      // console.log("Validation error:", error);
      let errMsg = error.details.map((el) => el.message).join(",");
      throw new ExpressError(404, errMsg);
    } else {
      next();
    }
  };



  app.use("/listings", listings);
  

//REVIEW post route
app.post("/listings/:id/reviews",validateReview,wrapAsync(async(req,res) => {
  let listing =await Listing.findById(req.params.id)
  let newReview = new Review(req.body.review);

  listing.reviews.push(newReview);
  await newReview.save();
  await listing.save();
  console.log("new review saved")
  // res.send("new review saved")
  res.redirect(`/listings/${listing._id}`);
}))
//del review route
app.delete("/listings/:id/reviews/:reviewID", wrapAsync(async(req, res)=>{
  let {id, reviewID} = req.params;
  await Listing.findByIdAndUpdate(id,{$pull: {reviews:reviewID}});
  await Review.findByIdAndDelete(reviewID);
  res.redirect(`/listings/${id}`);
})) 

app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found!"));
});
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong!" } = err;
  res.status(statusCode).render("error.ejs", { err: { message, stack: err.stack || null } });
});


  app.listen(8080, () => {
    console.log("server is listening to port 8080");
  });