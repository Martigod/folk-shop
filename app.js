const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const Product = require("./models/Product");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
mongoose.connect("mongodb://127.0.0.1:27017/folk-shop")
    .then(function () {
        console.log("Connected to MongoDB");
    })
    .catch(function (error) {
        console.log("MongoDB error:", error);
    });
app.get("/api/products", async function (req, res) {
    const products = await Product.find();
    res.json(products);
});
app.get("/api/products/:id", async function (req, res) {
    const product = await Product.findById(req.params.id);
    res.json(product);
});
app.listen(3000, function () {
    console.log("Server is running on http://localhost:3000");
});