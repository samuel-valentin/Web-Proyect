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
    CalculateTotal() {
        let total = 0;
        let product = null;
        for (let i = 0; i < this.proxies.length; i++) {
            console.log("Total de articulos: ", this.proxies.length);
            product = this.products.find(element => element._uuid === this.proxies[i].UUID);
            total += product._pricePerUnit * this.proxies[i].Quantity;
        }
        return total;
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
        elements += "\
        <div class=\"row\" >\
                <div class=\"col-5\">\
                    <img class=\"selected-product\" src=\"" + cart.products[i]._imageUrl + "\" alt=\"...\" style=\"width: 300px; border-radius: 10%;\">\
                </div>\
                <div class=\"col-7\">\
                    <h4><b>" + cart.products[i]._title + "   </b><button class=\"btn btn-danger\" onclick=\"DeleteProductFromCart('" + cart.products[i]._title + "')\"><i class=\"fa fa-trash icon\"></i></button></H4>\
                    <br>\
                    <div class=\"input-group\" style=\"width:60%\">\
                        <span class=\"input-group-text\"name=\"cant1\">Cantidad:</span>\
                        <input type=\"number\" id='" + cart.products[i]._title + "' class=\"form-control\" readonly value='value' placeholder='" + cart.products[i]._quantity + "' min='0'>\
                            <div id='edit" + cart.products[i]._title + "'>\
                                <div class=\"input-group-append\">\
                                    <button class=\"btn btn-info\" type=\"button\" onclick=\"EditProduct('" + cart.products[i]._title + "')\"><i class=\"fa fa-pencil icon\"></i></button>\
                                </div> \
                            </div> \
                    </div>\
                    <br>\
                    <div class=\"input-group\" style=\"width:60%\">\
                    <span class=\"input-group-text\" >Precio:</span>\
                        <input type=\"text\" class=\"form-control\" placeholder=\"" + cart.products[i]._pricePerUnit + "\" readonly>\
                        <span class=\"input-group-text\">$ m.n</span>\
                    </div>\
                </div>\
            </div>\
        <br>";
    }
    elements += "</div>";
    shopping.innerHTML = elements;
    updateCartBadge();
}

function ShowTotal() {
    let total = document.getElementById("total");
    let cart = sessionStorage.getItem("Cart");
    cart = JSON.parse(cart);
    let CalculateTotal = "<div> <h3><b>Total: </b></h3></div><div>";
    let Sum = 0.00;
    for (i = 0; i < cart.products.length; i++) {
        CalculateTotal += "<h4><b>" + cart.products[i]._title + "</b>:   " + cart.products[i]._quantity + " x $ " + cart.products[i]._pricePerUnit + "</h4><br>";
        Sum += cart.products[i]._quantity * cart.products[i]._pricePerUnit;
    }
    CalculateTotal += "<h3><b>Total: $ </b>" + Sum.toFixed(2) + "</h3></div>";
    total.innerHTML = CalculateTotal;
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

function SaveQuantity(idProduct) {
    console.log("Saving quantity of product " + idProduct);
    let product = document.getElementById(idProduct);
    console.log("New quantity: " + product.value);
    product.setAttribute("readonly", "");
    if (product.value == 0) {
        DeleteProductFromCart(idProduct);
    } else {
        let cart = sessionStorage.getItem("Cart");
        console.log("cart: " + cart)
        console.log("type of cart: " + typeof (cart)); //string
        cart = JSON.parse(cart);
        console.table(cart);
        console.log("type of cart: " + typeof (cart)); //object
        console.log("Producto " + Object.values(cart.products).length);
        for (let i = 0; i < Object.values(cart.products).length; i++) {
            if (Object.values(cart.products)[i]._title == idProduct) { //Update quantity
                console.log("Entro");
                console.log("Producto " + i + " " + Object.values(cart.products)[i]._title);
                Object.values(cart.products)[i]._quantity = product.value;
                console.table(Object.values(cart.products)[i]);
            }
        }
        sessionStorage.setItem("Cart", JSON.stringify(cart)); //Update cart
        let edit = document.getElementById("edit" + idProduct); //Change buttons
        edit.innerHTML = "\
        <div class=\"input-group-append\">\
             <button class=\"btn btn-info\" type=\"button\" onclick=\"EditProduct('" + idProduct + "')\"><i class=\"fa fa-pencil icon\"></i></button>\
        </div>";
        console.log("Quantity saved");
        ShowTotal();
    }

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