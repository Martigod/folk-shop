const mongoose = require("mongoose");
const orderSchema = new mongoose.Schema({
    buyerName: String,
    buyerAddress: String,
    products: [
        {
            productId: String,
            name: String,
            price: Number
        }
    ],
    totalPrice: Number,
    createdAt: {
        type: Date,
        default: Date.now
    }
});
const Order = mongoose.model("Order", orderSchema);
module.exports = Order;