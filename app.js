const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const Product = require("./Product");
const Order = require("./Order");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));
mongoose.connect("mongodb://127.0.0.1:27017/folk-shop")
    .then(function () {
        console.log("Connected to MongoDB");
    })
    .catch(function (error) {
        console.log("MongoDB error:", error);
    });
app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "index.html"));
});
app.get("/api/products", async function (req, res) {
    const products = await Product.find();
    res.json(products);
});
app.get("/api/products/:id", async function (req, res) {
    const product = await Product.findById(req.params.id);
    res.json(product);
});
app.post("/api/orders", async function (req, res) {
    const buyerName = req.body.buyerName;
    const buyerAddress = req.body.buyerAddress;
    const products = req.body.products;
    let totalPrice = 0;
    for (let i = 0; i < products.length; i++) {
        totalPrice = totalPrice + products[i].price;
    }
    const order = new Order({
        buyerName: buyerName,
        buyerAddress: buyerAddress,
        products: products,
        totalPrice: totalPrice
    });
    await order.save();
    res.json({
        message: "Поръчката беше запазена успешно"
    });
});
app.listen(3000, function () {
    console.log("Server is running on http://localhost:3000");
});