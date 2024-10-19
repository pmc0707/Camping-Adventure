const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("../MiniProject/models/listing.js")
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const path = require("path")
const methodOverride = require("method-override")
const ejsMate = require("ejs-mate");
const { wrapAsync } = require('./utils/WrapAsync.js');
const ExpressError = require('./utils/ExpressError.js')

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
//index route
  app.get("/listings", async(req,res) =>{
    const allListing =await Listing.find({});
    res.render("listings/index.ejs",{allListing})   
  })
  //new route
  app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs")
  })
  //show route

  app.get("/listings/:id", async (req, res) => {
      let { id } = req.params;
      id = id.trim();
      if (!mongoose.isValidObjectId(id)) {
          return res.status(400).send("Invalid listing ID.");
      }  
      try {
          const listing = await Listing.findById(id);
  
          if (!listing) {
              return res.status(404).send("Listing not found.");
          }  
          res.render("listings/show.ejs", { listing });
      } catch (err) {
          console.error(err);
          res.status(500).send("Server error while fetching listing.");
      }
  });
  //create route
  app.post("/listings",wrapAsync(async (req,res,next)=>{
    if(!req.body.listing){
      throw new ExpressError(400,"Send valid data for listing")
    }
      const newListing = new Listing(req.body.listing);
      await newListing.save();
      res.redirect("/listings");
  })
)
//edit route
app.get("/listings/:id/edit",wrapAsync(async(req,res)=>{
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/edit.ejs",{listing})
})
);
//update route
app.put("/listings/:id", wrapAsync(async (req, res) => {
  if(!req.body.listing){
    throw new ExpressError(400,"Send valid data for listing")
  }
  let { id } = req.params;
  await Listing.findByIdAndUpdate(id, {...req.body.listing});
  res.redirect(`/listings/${updatedListing._id}`);
}));
//delete route
app.delete("/listings/:id", wrapAsync(async (req, res,next) => {
 
    let { id } = req.params;
    let deleteListing = await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
}));

app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found!"));
});
// app.use((err, req, res, next) => {
//   const { statusCode = 500, message = "Something went wrong!" } = err;
//   res.status(statusCode).send(message);
//   res.render("error.ejs",{err})
// });
app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong!" } = err;
  res.status(statusCode).send(message);  // <-- This sends a response
  res.render("error.ejs",{err});         // <-- Another response is attempted here
});


  app.listen(8080, () => {
    console.log("server is listening to port 8080");
  });  