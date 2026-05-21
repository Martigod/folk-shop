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
    let params = new URLSearchParams(window.location.search);
    let productId = params.get("id");
    let reviewsList = document.getElementById("reviews-list");
    let reviewMessage = document.getElementById("review-message");
    function loadReviews() {
        fetch("/api/reviews/" + productId)
            .then(function (response) {
                return response.json();
            })
            .then(function (reviews) {
                reviewsList.innerHTML = "";
                if (reviews.length == 0) {
                    reviewsList.innerHTML = "<p>Все още няма ревюта за този продукт.</p>";
                } else {
                    for (let i = 0; i < reviews.length; i++) {
                        reviewsList.innerHTML += "<p><strong>Потребител:</strong> " + reviews[i].comment + "</p>";
                    }
                }
            });
    }
    loadReviews();
    reviewForm.addEventListener("submit", function (event) {
        event.preventDefault();
        let reviewText = document.getElementById("review-text").value;
        if (reviewText == "") {
            reviewMessage.textContent = "Моля, напишете коментар.";
            return;
        }
        fetch("/api/reviews", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                productId: productId,
                comment: reviewText
            })
        })
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            reviewMessage.textContent = "Ревюто беше добавено.";

            reviewForm.reset();

            loadReviews();
        });
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
// Админ панел
let adminProducts = document.getElementById("admin-products");
let adminOrders = document.getElementById("admin-orders");
let productForm = document.getElementById("product-form");

if (adminProducts != null && adminOrders != null) {
    loadAdminData();
}

function loadAdminData() {
    if (adminProducts == null || adminOrders == null) {
        return;
    }

    fetch("/api/products")
        .then(function (response) {
            return response.json();
        })
        .then(function (products) {
            fetch("/api/orders")
                .then(function (response) {
                    return response.json();
                })
                .then(function (orders) {
                    showAdminProducts(products, orders);
                    showAdminOrders(orders);
                });
        });
}
function showAdminProducts(products, orders) {
    adminProducts.innerHTML = "";
    for (let i = 0; i < products.length; i++) {
        let boughtCount = 0;

        for (let j = 0; j < orders.length; j++) {
            for (let k = 0; k < orders[j].products.length; k++) {
                if (orders[j].products[k].productId == products[i]._id) {
                    boughtCount = boughtCount + 1;
                }
            }
        }
        adminProducts.innerHTML += `
            <div class="admin-item">
                <p><strong>${products[i].name}</strong></p>
                <p>Цена: ${products[i].price} лв.</p>
                <p>Снимка: ${products[i].image}</p>
                <p>Закупен: ${boughtCount} пъти</p>
                <button onclick="editProduct('${products[i]._id}', '${products[i].name}', '${products[i].shortDescription}', '${products[i].fullDescription}', '${products[i].price}', '${products[i].image}')">
                    Редактирай
                </button>
                <button onclick="deleteProduct('${products[i]._id}')">
                    Изтрий
                </button>
            </div>
        `;
    }
}
function showAdminOrders(orders) {
    adminOrders.innerHTML = "";
    if (orders.length == 0) {
        adminOrders.innerHTML = "<p>Няма направени поръчки.</p>";
    } else {
        for (let i = 0; i < orders.length; i++) {
            let productsText = "";
            for (let j = 0; j < orders[i].products.length; j++) {
                productsText += orders[i].products[j].name + " - " + orders[i].products[j].price + " лв.<br>";
            }
            adminOrders.innerHTML += `
                <div class="admin-item">
                    <p><strong>Клиент:</strong> ${orders[i].buyerName}</p>
                    <p><strong>Адрес:</strong> ${orders[i].buyerAddress}</p>
                    <p><strong>Продукти:</strong><br>${productsText}</p>
                    <p><strong>Общо:</strong> ${orders[i].totalPrice} лв.</p>
                </div>
            `;
        }
    }
}
if (productForm != null) {
    productForm.addEventListener("submit", function (event) {
        event.preventDefault();
        let productId = document.getElementById("product-id").value;
        let name = document.getElementById("product-name").value;
        let shortDescription = document.getElementById("product-short").value;
        let fullDescription = document.getElementById("product-full").value;
        let price = document.getElementById("product-price").value;
        let image = document.getElementById("product-image").value;
        let productMessage = document.getElementById("product-message");
        if (name == "" || shortDescription == "" || fullDescription == "" || price == "" || image == "") {
            productMessage.textContent = "Моля, попълнете всички полета.";
            return;
        }
        let productData = {
            name: name,
            shortDescription: shortDescription,
            fullDescription: fullDescription,
            price: Number(price),
            image: image
        };
        if (productId == "") {
            fetch("/api/products", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(productData)
            })
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                productMessage.textContent = data.message;
                productForm.reset();
                loadAdminData();
            });
        } else {
            fetch("/api/products/" + productId, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(productData)
            })
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                productMessage.textContent = data.message;
                productForm.reset();
                document.getElementById("product-id").value = "";
                loadAdminData();
            });
        }
    });
}
function editProduct(id, name, shortDescription, fullDescription, price, image) {
    document.getElementById("product-id").value = id;
    document.getElementById("product-name").value = name;
    document.getElementById("product-short").value = shortDescription;
    document.getElementById("product-full").value = fullDescription;
    document.getElementById("product-price").value = price;
    document.getElementById("product-image").value = image;
    document.getElementById("product-message").textContent = "Редактирате продукт.";
}
function deleteProduct(id) {
    fetch("/api/products/" + id, {
        method: "DELETE"
    })
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        document.getElementById("product-message").textContent = data.message;
        loadAdminData();
    });
}
let clearProductFormButton = document.getElementById("clear-product-form");
if (clearProductFormButton != null) {
    clearProductFormButton.addEventListener("click", function () {
        productForm.reset();
        document.getElementById("product-id").value = "";
        document.getElementById("product-message").textContent = "";
    });
}
if (adminProducts != null && adminOrders != null) {
    fetch("/api/products")
        .then(function (response) {
            return response.json();
        })
        .then(function (products) {
            fetch("/api/orders")
                .then(function (response) {
                    return response.json();
                })
                .then(function (orders) {
                    adminProducts.innerHTML = "";
                    for (let i = 0; i < products.length; i++) {
                        let boughtCount = 0;
                        for (let j = 0; j < orders.length; j++) {
                            for (let k = 0; k < orders[j].products.length; k++) {
                                if (orders[j].products[k].productId == products[i]._id) {
                                    boughtCount = boughtCount + 1;
                                }
                            }
                        }
                        adminProducts.innerHTML += `
                            <div class="admin-item">
                                <p><strong>${products[i].name}</strong></p>
                                <p>Цена: ${products[i].price} лв.</p>
                                <p>Закупен: ${boughtCount} пъти</p>
                            </div>
                        `;
                    }
                    adminOrders.innerHTML = "";
                    if (orders.length == 0) {
                        adminOrders.innerHTML = "<p>Няма направени поръчки.</p>";
                    } else {
                        for (let i = 0; i < orders.length; i++) {
                            let productsText = "";
                            for (let j = 0; j < orders[i].products.length; j++) {
                                productsText += orders[i].products[j].name + " - " + orders[i].products[j].price + " лв.<br>";
                            }
                            adminOrders.innerHTML += `
                                <div class="admin-item">
                                    <p><strong>Клиент:</strong> ${orders[i].buyerName}</p>
                                    <p><strong>Адрес:</strong> ${orders[i].buyerAddress}</p>
                                    <p><strong>Продукти:</strong><br>${productsText}</p>
                                    <p><strong>Общо:</strong> ${orders[i].totalPrice} лв.</p>
                                </div>
                            `;
                        }
                    }
                });
        });
}