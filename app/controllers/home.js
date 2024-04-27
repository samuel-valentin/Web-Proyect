function showingProducts(selection) {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', 'http://localhost:3000/products');
    xhr.send();
    console.log("Showing products " + selection);
    let item = '';
    item += "<div class=\"container\"><div class=\"row\">";
    let cards = document.getElementById('tarjetas');
    console.log("Showing products " + selection);
    console.log("added html");
    xhr.onload = function () {
        let list = JSON.parse(xhr.response);
        let numberofProducts = Object.keys(list.products).length;
        console.log("Number of products: " + numberofProducts);
        let FourPerPage = Math.ceil(numberofProducts / 4);
        console.log("Number of pages: " + FourPerPage);
        if (selection == 1) {
            for (let i = 0; i < 4 && i < numberofProducts; i++) {
                console.log(Object.values(list.products)[i]._title);
                item += "\
                        <div class=\"d-block col-lg-3 d-block col-md-4 d-block col-sm-6 col-8\">\
                            <img class=\"card-img-top fotos\" src=\"" + Object.values(list.products)[i]._imageUrl + "\"  alt=\"Hola insertado\">\
                            <div class=\"card-body\">\
                                <h4 class=\"card-title\">" + Object.values(list.products)[i]._title + "</h4> \
                                <p class=\"card-text\">" + Object.values(list.products)[i]._description + "</p> \
                                <p class=\"card-text\"> Precio por unidad: " + Object.values(list.products)[i]._pricePerUnit + "</p> \
                                <button type=\"button\" class=\"btn btn-info\" href=\"#\"  data-bs-toggle=\"modal\" data-bs-target=\"#AddProduct\" onclick=\"SaveData(" + i + ")\">Agregar al Carrito</a>\
                            </div>\
                        </div>";
            }
        } else if (selection == 2) {
            for (let i = 4; i < 8 && i < numberofProducts; i++) {
                console.log(Object.values(list.products)[i]._title);
                item += "\
                        <div class=\"d-block col-lg-3 d-block col-md-4 d-block col-sm-6 col-8\">\
                            <img class=\"card-img-top fotos\" src=\"" + Object.values(list.products)[i]._imageUrl + "\"  alt=\"Hola insertado\">\
                            <div class=\"card-body\">\
                                <h4 class=\"card-title\">" + Object.values(list.products)[i]._title + "</h4> \
                                <p class=\"card-text\">" + Object.values(list.products)[i]._description + "</p> \
                                <p class=\"card-text\"> Precio por unidad: " + Object.values(list.products)[i]._pricePerUnit + "</p> \
                                <button type=\"button\" class=\"btn btn-info\" href=\"#\"  data-bs-toggle=\"modal\" data-bs-target=\"#AddProduct\" onclick=\"SaveData(" + i + ")\">Agregar al Carrito</a>\
                            </div>\
                        </div>";
            }
        } else if (selection == 3) {
            for (let i = 8; i < 14 && i < numberofProducts; i++) {
                console.log(Object.values(list.products)[i]._title);
                item += "\
                        <div class=\"d-block col-lg-3 d-block col-md-4 d-block col-sm-6 col-8\">\
                            <img class=\"card-img-top fotos\" src=\"" + Object.values(list.products)[i]._imageUrl + "\"  alt=\"Hola insertado\">\
                            <div class=\"card-body\">\
                                <h4 class=\"card-title\">" + Object.values(list.products)[i]._title + "</h4> \
                                <p class=\"card-text\">" + Object.values(list.products)[i]._description + "</p> \
                                <p class=\"card-text\"> Precio por unidad: " + Object.values(list.products)[i]._pricePerUnit + "</p> \
                                <button type=\"button\" class=\"btn btn-info\" href=\"#\"  data-bs-toggle=\"modal\" data-bs-target=\"#AddProduct\" onclick=\"SaveData(" + i + ")\">Agregar al Carrito</a>\
                            </div>\
                        </div>";
            }
        }
        item += "</div></div>";
        cards.innerHTML = item;

    }
}

function SaveData(ProductIndex) {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', 'http://localhost:3000/products');
    xhr.send();
    xhr.onload = function () {
        let list = JSON.parse(xhr.response);
        let Product = Object.values(list.products)[ProductIndex];
        sessionStorage.setItem("Product", JSON.stringify(Product));
        console.log("Nombre: " + Product._title);
        console.log("Data: " + sessionStorage.getItem("Product"));
    }
}

function DeleteData() {
    sessionStorage.removeItem("ProductName");
    console.log("Product not added");
    console.log("Data: " + sessionStorage.getItem("ProductName"));
}

function AddCart() {
    var cart;
    if (sessionStorage.getItem("Cart") == null) {
        cart = "{\"products\":[]}";
        console.log("cart parsed")
        sessionStorage.setItem("Cart", cart);
        cart = JSON.parse(cart);
    } else {
        cart = sessionStorage.getItem("Cart");
        console.log("cart: " + cart)
        console.log("type of cart: " + typeof (cart)); //string
        cart = JSON.parse(cart);
        console.table(cart);
        console.log("type of cart: " + typeof (cart)); //object
    }
    let product = sessionStorage.getItem("Product");
    let quantity = document.getElementById("quantity").value;
    console.log("quantity: " + quantity);
    product = JSON.parse(product)
    product._quantity = quantity; //add quantity to product
    console.table(product);
    flag = false;
    for (let i = 0; i < Object.values(cart.products).length; i++) {
        if (Object.values(cart.products)[i]._title == product._title) {
            console.log("Product already in cart");
            (cart.products)[i] = product; //update product in cart
            flag = true;
            break;
        }
    }
    if (flag == false) {
        cart.products.push(product); //add product to cart
        console.log("Product added");
    }

    console.table(cart);
    console.log(cart.products[0]._title);
    sessionStorage.setItem("Cart", JSON.stringify(cart));
}

function SendShoppingCart() {
    console.log("Sendinddg shopping cart");
    let xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://localhost:3000/products/cart');
    xhr.setRequestHeader('Content-Type', 'application/json');
    let cart = sessionStorage.getItem("Cart");
    console.log("cart: " + cart);
    xhr.send(cart);
    xhr.onload = function () {
        console.log("Shopping cart sent");
        if (xhr.status == 200) {
            window.location.href = "http://localhost:3000/shopping_cart"
        }
    }
}