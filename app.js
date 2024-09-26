const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Mongo_url="mongodb://127.0.0.1:27017/wanderlust"; //will be created when a colection is added in it
const path = require("path")
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const exp = require("constants");
const ExpressError = require("./utils/expressError.js");
// const Listing = require("./models/listing.js");
// const Review = require("./models/review.js");
// const wrapAsync = require("./utils/wrapAsync.js");
// const {listingSchema,reviewSchema } = require("./schema.js");
const listings = require("./router/listing.js");
const reviews = require("./router/review.js");

//connect to mongodb
async function main() {
    await mongoose.connect(Mongo_url);
}

app.set("view engine","ejs"); //^
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

app.use("/listings",listings);
app.use("/listings/:id/reviews", reviews);

main()
    .then(()=>{
        console.log("connected");
    })
    .catch((err)=>{
        console.log("error");
        
    })

app.all("*",(req,res,next)=>{    //if wrong route was searched
    next(new ExpressError(404,"Page not found!"));
});

app.use((err,req,res,next)=>{   //if err found in any route
    let{ statusCode=500, message="OOPS!!! Something went wrong"} = err;  //default answer
    console.log(err);
    res.status(statusCode).render("error.ejs",{message});
    console.log("msg:",statusCode,message)
    // res.status(statusCode).send(message); //else this
});

app.listen(8080, ()=>{
    console.log("listening to port 8080");
});

//test list
// app.get("/testListing",async(req,res) =>{
//     let sampleListing = new Listing({
//         title:"Villa",
//         description:"big",
//         price:3000,
//         location:"delhi",
//         country:"india",
//     });
//     await sampleListing.save();
//     console.log("sample");
//     res.send("success");
// });
