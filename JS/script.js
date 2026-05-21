function getCart() {
    let cart = localStorage.getItem("cart");
    if (cart == null) {
        return [];
    }
    return JSON.parse(cart);
}
function saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
}
let productsDiv = document.getElementById("products");
if (productsDiv != null) {
    fetch("/api/products")
        .then(function (response) {
            return response.json();
        })
        .then(function (products) {
            productsDiv.innerHTML = "";
            for (let i = 0; i < products.length; i++) {
                productsDiv.innerHTML += `
                    <div class="product-card">
                        <img src="images/${products[i].image}" alt="${products[i].name}">
                        <h3>${products[i].name}</h3>
                        <p>${products[i].shortDescription}</p>
                        <p class="price">Цена: ${products[i].price} лв.</p>
                        <a class="button" href="product.html?id=${products[i]._id}">Виж повече</a>
                    </div>
                `;
            }
        });
}
let addButtons = document.querySelectorAll(".add-to-cart");
for (let i = 0; i < addButtons.length; i++) {
    addButtons[i].addEventListener("click", function () {
        let productName = this.getAttribute("data-name");
        let productPrice = Number(this.getAttribute("data-price"));
        let cart = getCart();
        let product = {
            name: productName,
            price: productPrice
        };
        cart.push(product);
        saveCart(cart);
        let message = document.querySelector(".cart-message");
        if (message != null) {
            message.textContent = "Продуктът беше добавен в количката.";
        }
    });
}
let cartItems = document.getElementById("cart-items");
let totalPrice = document.getElementById("total-price");
if (cartItems != null) {
    let cart = getCart();
    let total = 0;
    if (cart.length == 0) {
        cartItems.innerHTML = "<p>Количката е празна.</p>";
    } else {
        for (let i = 0; i < cart.length; i++) {
            cartItems.innerHTML += "<p>" + cart[i].name + " - " + cart[i].price + " лв.</p>";
            total = total + cart[i].price;
        }
    }
    totalPrice.textContent = total;
}
let clearCartButton = document.getElementById("clear-cart");
if (clearCartButton != null) {
    clearCartButton.addEventListener("click", function () {
        localStorage.removeItem("cart");
        location.reload();
    });
}
let orderForm = document.getElementById("order-form");
if (orderForm != null) {
    orderForm.addEventListener("submit", function (event) {
        event.preventDefault();
        let name = document.getElementById("buyer-name").value;
        let address = document.getElementById("buyer-address").value;
        let cart = getCart();
        if (name == "" || address == "") {
            document.getElementById("order-message").textContent = "Моля, попълнете име и адрес.";
            return;
        }
        if (cart.length == 0) {
            document.getElementById("order-message").textContent = "Количката е празна.";
            return;
        }
        fetch("/api/orders", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                buyerName: name,
                buyerAddress: address,
                products: cart
            })
        })
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                document.getElementById("order-message").textContent = name + ", благодарим за поръчката!";
                localStorage.removeItem("cart");
                cartItems.innerHTML = "<p>Количката е празна.</p>";
                totalPrice.textContent = "0";
                orderForm.reset();
            });
    });
}
let reviewForm = document.getElementById("review-form");
if (reviewForm != null) {
    reviewForm.addEventListener("submit", function (event) {
        event.preventDefault();
        let reviewText = document.getElementById("review-text").value;
        let reviewsList = document.getElementById("reviews-list");
        let reviewMessage = document.getElementById("review-message");
        if (reviewText == "") {
            reviewMessage.textContent = "Моля, напишете коментар.";
            return;
        }
        reviewsList.innerHTML += "<p><strong>Нов потребител:</strong> " + reviewText + "</p>";
        reviewMessage.textContent = "Ревюто беше добавено.";
        reviewForm.reset();
    });
}
let productDetails = document.getElementById("product-details");
if (productDetails != null) {
    let params = new URLSearchParams(window.location.search);
    let productId = params.get("id");
    fetch("/api/products/" + productId)
        .then(function (response) {
            return response.json();
        })
        .then(function (product) {
            productDetails.innerHTML = `
                <h2>${product.name}</h2>
                <img src="images/${product.image}" alt="${product.name}">
                <p class="short-description">
                    ${product.shortDescription}
                </p>
                <p>
                    ${product.fullDescription}
                </p>
                <p class="price">Цена: ${product.price} лв.</p>
            `;
            let addProductButton = document.getElementById("add-product-button");
            addProductButton.addEventListener("click", function () {
                let cart = getCart();
                let productForCart = {
                    productId: product._id,
                    name: product.name,
                    price: product.price
                };
                cart.push(productForCart);
                saveCart(cart);
                let message = document.querySelector(".cart-message");
                message.textContent = "Продуктът беше добавен в количката.";
            });
        });
}