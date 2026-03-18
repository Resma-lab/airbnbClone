const mongoose = require("mongoose");
const review = require("./review.js");
const user = require("./user.js");
const Schema = mongoose.Schema;
const {cloudinary} = require("../cloudConfig.js"); 

const listingSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    images: [
        {
            url: String,
            filename: String
       },
   ],
    price: Number,
    location: String,
    country: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        }
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"         
    },
    geometry: {
        type: {
            type: String, // Don't do `{ location: { type: String } }`
            enum: ["Point"], // 'location.type' must be 'Point'
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
});

listingSchema.post("findOneAndDelete", async function (listing) {
    
    if (listing) {
        // Delete all associated reviews
        await review.deleteMany({
            _id: {
                $in: listing.reviews
            }
        });
        // Delete images from Cloudinary
        for (let image of listing.images) {
            try {
                await cloudinary.uploader.destroy(image.filename);
            } catch (err) {
                console.error(`Cloudinary deletion failed for ${image.filename}:`, err);
            }
        }
    }
});

const Listing = mongoose.model("Listing",listingSchema);
module.exports = Listing;
