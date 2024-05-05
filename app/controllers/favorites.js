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
    for (i = 0; i < cart.products.length; i++) {
        elements = "\
        <div class=\"row\" style=\"padding-left: 60px;\">\
            <div style=\"text-align: center; width: 20%;\">\
                <img class=\"selected-product\" src=\"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSG_Cer1Sx_lxOFdFxD1CfbBcDn19o-a9chfQ&s\" alt=\"...\" style=\"max-width: 100%;\">\
            </div>\
            <div style=\"width: 60%; padding-left: 1%;\">\
                <h4 style=\"font-size: 26px; font-family: 'Hammersmith'; text-transform: uppercase; text-decoration: underline; text-decoration-thickness: 1px;\">Título del Producto</h4>\
                <div>\
                    <p style=\"font-family: 'Space'; font-size: 16px;\">Info from recipe</p>\
                </div>\
                <div class=\"input-group\" style=\"width: 60%\">\
                     <button class=\"buttonRecipe\">Full Recipe</button>\
                     <button class=\"buttonDelete\">Delete</button>\
                </div>\
                <br>\
                <p style=\"font-family: 'Space'; font-size: 13px;\">Created by <a><b><u>User</u></b></a></p>\
                <div>\
                    <button class=\"tag\">Tag</button>\
                    <button class=\"tag\">Tag</button>\
                </div>\
            </div>\
        </div>";

    }
    elements += "</div>";
    shopping.innerHTML = elements;
    updateCartBadge();
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
