function ShowRegister() {
    // Comprobar si el contenedor de registro ya existe
    if (document.querySelector(".registration-container")) {
        return; // Detener la ejecución si el contenedor ya existe
    }
    // Crear el contenedor el formulario y agregar el contenido
    let registrationContainer = document.createElement("section");
    registrationContainer.id = "registration-container";
    registrationContainer.classList.add("registration-container");
    registrationContainer.innerHTML = `
    <section aria-labelledby="signUp" role="region">
        <div id="signUp" class="signUp">
            <div class="image-signUp">
                <img src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Your Image" style="max-width: 800px;">
            </div>
            <div class="text-signUp">
                <h2>CREATE AN ACCOUNT</h2>
                <p id="textsigup">Already have an account? <button type="button" class="blackbuttonlogin" onclick="ShowLogIn()">Log In</button></p>
                <p id="emailLabel">EMAIL ADDRESS</p>
                <input id="emailInput" class="form-control col-13" type="text">
                <p id="passwordLabel">PASSWORD</p>
                <input id="passwordInput" class="form-control col-13" type="text">
                <p id="usernameLabel">USERNAME</p>
                <input id="usernameInput" class="form-control col-13" type="text">                
                <a id="blackbutton" onclick='register(event)'>Start baking!</a>
            </div>
        </div>
    </section>
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
              <form id="loginForm" class="w-100" onsubmit="login(event)">
                <div class="form-group">
                  <label for="email" id="register">EMAIL ADDRESS</label>
                  <div class="input-group mb-3">
                    <input type="text" class="w-100 form-control" name="email" id="emailInputLogin"
                        aria-describedby="helpId" required>
                  </div>
                </div>
                <div class="form-group">
                  <label for="password" id="register">PASSWORD</label>
                  <div class="input-group mb-3">
                    <input type="password" class="w-100 form-control" name="password" id="passwordInputLogin"
                        aria-describedby="helpId" required>
                  </div>
                </div>
                <div class="form-group">
                  <div class="d-flex justify-content-center">
                    <button id="blackbuttonlogin" type="submit" class="btn btn-success">Log In</button>
                  </div>
                </div>
                <p id="textlogin" class="d-flex justify-content-center">Don't have an account?  
                  <a data-dismiss="modal" href="#signUp" onclick="ShowRegister()">  Sign Up</a>
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
