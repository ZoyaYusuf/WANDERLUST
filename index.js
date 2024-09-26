const mongoose = require("mongoose");
const listing = require("../models/listing.js");
const initData = require("./data.js");

const Mongo_url="mongodb://127.0.0.1:27017/wanderlust"; //will be created when a colection is added in it

main()
    .then(()=>{
        console.log("connected");
    })
    .catch((err)=>{
        console.log("error");
        
    })

//connect to mongodb
async function main() {
    await mongoose.connect(Mongo_url);
}

const initDB = async () => {
    await listing.deleteMany({});
    await listing.insertMany(initData.data);
}

initDB();