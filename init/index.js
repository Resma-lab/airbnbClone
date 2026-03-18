const mongoose = require("mongoose");
const Review = require("../models/review.js");
const initData = require("./data.js");
const Listing = require("../models/listing.js");
const {cloudinary} = require("../cloudConfig.js"); 

//const MONGO_URL = 'mongodb://127.0.0.1:27017/wanderlust';
const dbUrl = process.env.ATLASDB_URL;

main()
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err)=>{
    console.log(err);
  }); 

async function main() {
    await mongoose.connect(MONGO_URL);    
}

//intialize database
const initDB = async () => {
    await Listing.deleteMany({});
    await Review.deleteMany({});
    initData.data = initData.data.map((obj) => ({
      ...obj, 
      owner: ("681a4c7fae3303ada19d91a6"),
      geometry: {
        type: "Point",
        coordinates: [85.8246, 20.2960] // default/fake coords
      }, // Replace with the actual ObjectId of the user
    }));
    await Listing.insertMany(initData.data);
    console.log("data was initialiazed");
};

initDB();


