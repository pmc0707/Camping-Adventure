const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("../MiniProject/models/listing.js")
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const path = require("path")
const methodOverride = require("method-override")


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
  app.post("/listings",async (req,res)=>{
  const newListing = new Listing(req.body.listing);
  await newListing.save();
  res.redirect("/listings");
  })
//edit route
app.get("/listings/:id/edit",async(req,res)=>{
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/edit.ejs",{listing})
})

//update route
app.put("/listings/:id", async (req, res) => {
  const { id } = req.params;
  const updatedListing = await Listing.findByIdAndUpdate(id, req.body.listing, { new: true });
  res.redirect(`/listings/${updatedListing._id}`);
});

app.delete("/listings/:id", async (req, res) => {
  try {
    let { id } = req.params;
    let deleteListing = await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

  app.listen(8080, () => {
    console.log("server is listening to port 8080");
  });  