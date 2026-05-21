const mongoose = require("mongoose");
const reviewSchema = new mongoose.Schema({
    productId: String,
    comment: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});
const Review = mongoose.model("Review", reviewSchema);
module.exports = Review;