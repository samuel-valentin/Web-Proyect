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

function ShowRegister() {
    // Comprobar si el contenedor del formulario ya existe
    let existingContainer = document.getElementById("registration-container");
    if (existingContainer) {
        console.log("El formulario de registro ya está visible.");
        // Si ya existe, simplemente hacer scroll hasta ese elemento
        existingContainer.scrollIntoView({ behavior: "smooth" });
        return;
    }
    
    // Crear el contenedor del formulario y agregar el contenido
    let registrationContainer = document.createElement("section");
    registrationContainer.id = "registration-container";
    registrationContainer.classList.add("registration-container");
    registrationContainer.innerHTML = `
    <form id="registrationForm" onsubmit="registerUser(event); return false;">
        <div class="image-signUp">
            <img src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Your Image" style="max-width: 800px;">
        </div>
        <div class="text-signUp">
            <h2>CREATE AN ACCOUNT</h2>
            <p id="textsigup">Already have an account? <button type="button" class="blackbuttonlogin" onclick="ShowLogIn()">Log In</button></p>
            <p id="sign">EMAIL ADDRESS</p>
            <input id="email" name="email" class="form-control col-13" type="email" required>
            <p id="sign">PASSWORD</p>
            <input id="password" name="password" class="form-control col-13" type="password" required>
            <p id="sign">USERNAME</p>
            <input id="username" name="username" class="form-control col-13" type="text" required>
            <button type="submit" id="blackbutton">Start baking!</button>
        </div>
    </form>
    `;

    // Insertar el contenedor del formulario debajo del botón "Bake with us"
    document.getElementById("dynamic-content").appendChild(registrationContainer);
    // Hacer scroll hasta el formulario de registro
    registrationContainer.scrollIntoView({ behavior: "smooth" });    
}

function registerUser(event) {
    event.preventDefault();  // Detiene el envío del formulario
    const data = {
        name: document.getElementById('username').value,
        email: document.getElementById('email').value,
        password: document.getElementById('password').value
    };

    let xhr = new XMLHttpRequest();
    xhr.open('POST', '/user/register', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(data));

    xhr.onload = function() {
        if (xhr.status === 201) {
            console.log('Registro exitoso');
            window.location.href = '/profile';
        } else {
            console.error('Error en el registro: ' + xhr.responseText);
        }
    };
}

function ShowLogIn() {
    // Comprobar si el modal ya existe
    let existingModal = document.getElementById("login");
    if (existingModal) {
        var modal = new bootstrap.Modal(existingModal);
        modal.show(); // Mostrar el modal existente
        console.log("El modal de inicio de sesión ya está visible.");
        return; // Salir de la función si el modal ya existe
    }

    // Crear el contenedor del modal
    let modalContainer = document.createElement("div");
    modalContainer.classList.add("modal", "fade");
    modalContainer.id = "login";
    modalContainer.setAttribute("tabindex", "-1");
    modalContainer.setAttribute("aria-labelledby", "modelTitleId");
    modalContainer.setAttribute("aria-hidden", "true");

    modalContainer.innerHTML = `
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content custom-modal text-signUp  align-items-center">
          <div class="modal-header">
            <h2 class="modal-title" id="modaltitle">WELCOME BACK</h2>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
  
          <div class="modal-body">
            <div class="container-fluid d-flex flex-column align-items-center">
              <p id="textlogin">Log In to your account and continue baking!</p>
              <form id="loginForm" class="w-100">
                <div class="form-group">
                  <label for="email" id="register">EMAIL ADDRESS</label>
                  <div class="input-group mb-3">
                    <input type="text" class="w-100 form-control" name="email" id="email"
                        aria-describedby="helpId" required>
                  </div>
                </div>
                <div class="form-group">
                  <label for="password" id="register">PASSWORD</label>
                  <div class="input-group mb-3">
                    <input type="password" class="w-100 form-control" name="password" id="password"
                        aria-describedby="helpId" required>
                  </div>
                </div>
                <div class="form-group">
                  <div class="d-flex justify-content-center">
                    <button id="blackbuttonlogin" type="submit" class="btn btn-success">Log In</button>
                  </div>
                </div>
                <p id="textlogin" class="d-flex justify-content-center">Don't have an account?  
                  <a data-dismiss="modal" href="#signUp" onclick="ShowRegister()"> Sign Up</a>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    `;
  
    //Agregar el contenedor del modal al documento
    document.body.appendChild(modalContainer);
  
    // Inicializar el modal
    var modal = new bootstrap.Modal(modalContainer);
  
    // Mostrar el modal
    modal.show();
}

function closeAndShowSignUp() {
    $('#login').modal('hide'); // Cierra el modal usando jQuery
    ShowRegister(); // Llama a ShowRegister para mostrar el formulario y hacer scroll
}

function loginUser(email, password) {
    const data = { email, password };

    let xhr = new XMLHttpRequest();
    xhr.open('POST', '/user/login', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(data));

    xhr.onload = function() {
        if (xhr.status === 200) {
            console.log('Inicio de sesión exitoso');
            // Redirigir al usuario a la página de perfil o donde sea necesario
            window.location.href = '/profile';
        } else {
            console.error('Error en el inicio de sesión: ' + xhr.responseText);
        }
    };
}