const mongoose = require("mongoose");
const Product = require("./models/Product");
mongoose.connect("mongodb://127.0.0.1:27017/folk-shop")
    .then(async function () {
        console.log("Connected to MongoDB");
        await Product.deleteMany();

        await Product.create([
            {
                name: "Дамски скарпини",
                shortDescription: "Удобни обувки за народни танци и репетиции.",
                fullDescription: "Тези дамски скарпини са подходящи за хора, които танцуват народни танци, участват в репетиции или сценични изяви.",
                price: 75,
                image: "damski-skarpini.jpg"
            },
            {
                name: "Мъжки скарпини",
                shortDescription: "Здрави и удобни обувки за танцьори.",
                fullDescription: "Тези мъжки скарпини са подходящи за народни танци, репетиции и сценични участия.",
                price: 80,
                image: "mazhki-skarpini.jpg"
            },
            {
                name: "Цървули",
                shortDescription: "Традиционни цървули за фолклорни изпълнения.",
                fullDescription: "Цървулите са подходящи за народни носии, сценични изяви и фолклорни събития.",
                price: 45,
                image: "carvuli.jpg"
            },
            {
                name: "Тениска с шевица",
                shortDescription: "Памучна тениска с български фолклорен мотив.",
                fullDescription: "Тениската е подходяща за ежедневна употреба, репетиции или фолклорни събития.",
                price: 35,
                image: "teniska.jpg"
            },
            {
                name: "Чанта с бродерия",
                shortDescription: "Практична чанта с фолклорна бродерия.",
                fullDescription: "Чантата е подходяща за ежедневна употреба и има красив фолклорен елемент.",
                price: 50,
                image: "chanta.jpg"
            }
        ]);
        console.log("Products added");
        mongoose.connection.close();
    })
    .catch(function (error) {
        console.log("Error:", error);
    });