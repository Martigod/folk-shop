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
        message.textContent = "Продуктът беше добавен в количката.";
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

        document.getElementById("order-message").textContent = name + ", благодарим за поръчката!";

        localStorage.removeItem("cart");
        cartItems.innerHTML = "<p>Количката е празна.</p>";
        totalPrice.textContent = "0";

        orderForm.reset();
    });
}