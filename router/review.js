const express = require("express");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/expressError.js");
const {reviewSchema } = require("../schema.js");
const Review = require("../models/review.js");
const router = express.Router({mergeParams: true});
const Listing = require("../models/listing.js");


const validateReview = (req,res,next)=>{
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
}

//REVIEWS
router.post("/", validateReview, wrapAsync(async(req,res,next)=>{
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    listing.review.push(newReview);
    await newReview.save();
    await listing.save();
    console.log("review saved");
    res.redirect(`/listings/${listing._id}`);
}));

//del review
router.delete("/:reviewId" ,wrapAsync(async(req,res,next)=>{
    let{id, reviewId} = req.params;
    await Listing.findByIdAndUpdate(id, {$pull : {review : reviewId}});
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);
}));


module.exports = router;


// //REVIEWS
// app.post("/listings/:id/reviews", validateReview, wrapAsync(async(req,res,next)=>{
//     let listing = await Listing.findById(req.params.id);
//     let newReview = new Review(req.body.review);
//     listing.review.push(newReview);
//     await newReview.save();
//     await listing.save();
//     console.log("review saved");
//     res.redirect(`/listings/${listing._id}`);
// }));

// //del review
// app.delete("/listings/:id/reviews/:reviewId" ,wrapAsync(async(req,res,next)=>{
//     let{id, reviewId} = req.params;
//     await Listing.findByIdAndUpdate(id, {$pull : {review : reviewId}});
//     await Review.findByIdAndDelete(reviewId);
//     res.redirect(`/listings/${id}`);
// }));
