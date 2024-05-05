class ShoppingCart {

    constructor(products) {
        this.proxies = []
        this.products = products;
    }
    addItem(productUUid, amount) {
        if (this.proxies.find(element => productUUid === element.UUID) === undefined) {
            this.proxies.push(new ProductProxy(productUUid, amount));
        } else {
            let index = this.proxies.findIndex(element => productUUid === element.UUID);
            this.proxies[index].Quantity += amount;
        }
    }
    updateItem(productUuid, newAmount) {
        if (newAmount < 0) {
            throw new ShoppingCartException("New amount cannot be negative");
        }
        const existingProduct = this.proxies.find(element => productUuid === element.UUID);

        if (existingProduct === undefined) {
            throw new ShoppingCartException("The product is not in the shopping cart");
        } else if (newAmount === 0) {
            this.removeItem(productUuid);
        } else {
            let index = this.proxies.findIndex(element => productUuid === element.UUID);
            this.proxies[index].Quantity = newAmount;
        }
    }
    removeItem(productUUid) {
        if (this.proxies.find(element => productUUid === element.UUID) === undefined) {
            throw new ShoppingCartException("The product is not in the shopping cart");
        } else {
            let index = this.proxies.findIndex(element => productUUid === element.UUID);
            this.products.splice(index, 1);
            this.proxies.splice(index, 1);
        }

    }
}
class ProductProxy {
    constructor(UUID, Quantity) {
        this.UUID = UUID;
        this.Quantity = Quantity;
    }
}

class ShoppingCartException {
    constructor(message) {
        this.message = message;
    }
}

function ShowCart() {
    let cart = sessionStorage.getItem("Cart");
    console.log("cart in the shopping cart: " + cart);
    cart = JSON.parse(cart);
    let elements = "";
    let shopping = document.getElementById("shopping");
    let price = "";
    for (i = 0; i < cart.products.length; i++) {
        elements = "\
        <div class=\"row\" style=\"padding-left: 60px; padding-top: 40px;\">\
            <div style=\"text-align: center; width: 20%;\">\
                <img class=\"selected-product\" src=\"https://images.unsplash.com/photo-1558961363-fa8fdf82db35?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGJha2VyeXxlbnwwfHwwfHx8MA%3D%3D\" alt=\"...\" style=\"width: 100%;\">\
            </div>\
            <div style=\"width: 60%; padding-left: 2%;\">\
                <h4 style=\"font-size: 26px; font-family: 'Hammersmith'; text-transform: uppercase; text-decoration: underline; text-decoration-thickness: 1px;\">Título del Producto</h4>\
                <div>\
                    <p style=\"font-family: 'Space'; font-size: 13px;\">Created by <a><b><u>User</u></b></a></p>\
                </div>\
                <div>\
                    <button class=\"tag\">Tag</button>\
                    <button class=\"tag\">Tag</button>\
                </div>\
                <div style=\"width: 60%; padding-top:15px; font-family: 'Space';\">\
                    <p style=\"font-weight: 650; font-size: 20px;\">Ingredients</p>\
                    <ul>\
                        <li>Ingredient 1</li>\
                        <li>Ingredient 2</li>\
                        <li>Ingredient 3</li>\
                    </ul>\
                </div>\
            </div>\
        </div>\
        <div style=\"padding-left: 60px; padding-top: 20px; font-family: 'Space';\">\
            <p style=\"font-weight: 650; font-size: 20px;\">Instructions</p>\
            <p>Description of recipe</p>\
        </div>";
        
    }
    elements += "</div>";
    shopping.innerHTML = elements;
    updateCartBadge();
}

function EditProduct(idProduct) {
    console.log("Editing product " + idProduct);
    let product = document.getElementById(idProduct);
    product.removeAttribute("readonly");
    let edit = document.getElementById("edit" + idProduct);
    edit.innerHTML = "\
    <div class=\"input-group-append\">\
        <button class=\"btn btn-success\" type=\"button\" onclick=\"SaveQuantity('" + idProduct + "')\"><i class=\"fa fa-check icon\"></i></button>\
        <button class=\"btn btn-danger\" type=\"button\" onclick=\"CancelEdit('" + idProduct + "')\"><i class=\"fa fa-close icon\"></i></button>\
    </div>";
    console.log("Edition available");
}

function CancelEdit(idProduct) {
    console.log("Canceling edit of product " + idProduct);
    let product = document.getElementById(idProduct);
    product.setAttribute("readonly", "");
    let edit = document.getElementById("edit" + idProduct);
    edit.innerHTML = "\
    <div class=\"input-group-append\">\
         <button class=\"btn btn-info\" type=\"button\" onclick=\"EditProduct('" + idProduct + "')\"><i class=\"fa fa-pencil icon\"></i></button>\
    </div>";
    console.log("Edition canceled");
}

function DeleteProductFromCart(ProductName) {
    console.log("Deleting product " + ProductName);
    let cart = sessionStorage.getItem("Cart");
    cart = JSON.parse(cart);
    for (let i = 0; i < Object.values(cart.products).length; i++) {
        if (Object.values(cart.products)[i]._title == ProductName) {
            console.log("Entro");
            console.log("Producto " + i + " " + Object.values(cart.products)[i]._title);
            (cart.products).splice(i, 1);
            console.table(Object.values(cart.products)[i]);
        }
    }
    sessionStorage.setItem("Cart", JSON.stringify(cart));
    ShowCart();
    ShowTotal();
}

function updateCartBadge() {
    let cart = sessionStorage.getItem("Cart");
    if (cart) {
        cart = JSON.parse(cart);
        let cartCount = 0;
        cart.products.forEach(product => {
            cartCount += parseInt(product._quantity);
        });
        document.getElementById("cart-count").innerText = cartCount;
    }
}