const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("../MiniProject/models/listing.js")
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const path = require("path")
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

  app.listen(8080, () => {
    console.log("server is listening to port 8080");
  });  