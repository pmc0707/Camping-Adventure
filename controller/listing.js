const Listing = require("../models/listing");
module.exports.index = async (req, res) => {
    const allListing = await Listing.find({});
    res.render("listings/index.ejs", { allListing })
}

module.exports.renderNewForm= (req, res) => {
    res.render("listings/new.ejs");
}

 module.exports.showListing =async (req, res) => {
    let { id } = req.params;

        const listing = await Listing.findById(id)
        .populate({path:"reviews",
            populate:{path:"author"}})
        .populate("owner");
        if (!listing) {
            req.flash("error", "Listing you are requested for doesn't exist!");
            res.redirect("/listings");
        }
        res.render("listings/show.ejs",{listing});
};

module.exports.createListing=async (req, res, next) => {
    let url = req.file.path;
    let filename = req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.image = {url,filename};
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success","New Listing Created!");
    res.redirect("/listings");
}
 module.exports.editListing= async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing) {
        req.flash("error","Listing you requested for does not exist!");
        req.redirect("/listings");
    }
    res.render("listings/edit.ejs", { listing })
}

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success"," Listing Updtaed Successfully!")
    res.redirect(`/listings/${id}`);
}

module.exports.deleteListing=async (req, res) => {
    let { id } = req.params;
    let deleteListing = await Listing.findByIdAndDelete(id);
    req.flash("success"," Listing Deleted Successfully!")
    res.redirect("/listings");
}