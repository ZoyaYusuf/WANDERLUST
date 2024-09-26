const express = require("express");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/expressError.js");
const {listingSchema } = require("../schema.js");
const Review = require("../models/review.js");
const router = express.Router({mergeParams: true});
const Listing = require("../models/listing.js");

const validateListing = (req,res,next)=>{
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",");
        console.log("valid err",error);
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
}

  //index route
router.get("/", wrapAsync(async(req,res,next)=>{
    const AllListing = await Listing.find({}).populate("image");
    res.render("./listing/index.ejs",{AllListing});
}));

//new route
router.get("/new", wrapAsync(async(req,res,next)=>{
    res.render("./listing/new.ejs");
    // res.redirect("/listings");
}));

//show route
router.get("/:id", wrapAsync(async(req,res,next)=>{
    let{id} = req.params;
    const listing = await Listing.findById(id).populate("review");
    res.render("./listing/show.ejs",{listing});
}));

//create route
router.post("/", validateListing, wrapAsync(async(req,res,next)=>{   
    const newLisitng = new Listing(req.body.listing);  //^
    await newLisitng.save();  //^
    res.redirect("/listings");
}));

//edit route
router.get("/:id/edit", wrapAsync(async(req,res,next) =>{
    let{id} = req.params;
    const listing = await Listing.findById(id);
    res.render("./listing/edit.ejs",{listing});
}));

// update route
router.put("/:id", wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    // Extract the image URL from the form data
    const updatedListing = { ...req.body.listing };
    // If the image is provided as a URL string, store it directly
    if (updatedListing.image && typeof updatedListing.image === 'string') {
        updatedListing.image = { url: updatedListing.image, filename: "listingimage" }; // You can manage filename if required
    }
    await Listing.findByIdAndUpdate(id, updatedListing);
    res.redirect(`/listings/${id}`);
}));


//delete
router.delete("/:id", async(req,res)=>{
    let{id} = req.params;
    let deletedListings =  await Listing.findByIdAndDelete(id);
    console.log(deletedListings);
    res.redirect("/listings");
    
});

module.exports = router;



