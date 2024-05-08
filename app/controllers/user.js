function fetchUserProfile() {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', '/user/info', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("UserValidation"));
    xhr.send();
    xhr.onload = function () {
        if (xhr.status == 200) {
            const user = JSON.parse(xhr.responseText);
            // Procesar la información del usuario
        } else {
            console.error("Error fetching user data:", xhr.responseText);
        }
    };
}

function register(event) {
    let xhr = new XMLHttpRequest();
    xhr.open('POST', '/user/home', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    let name = document.getElementById("usernameInput").value;
    let email = document.getElementById("emailInput").value;
    let password = document.getElementById("passwordInput").value;

    if (!name || !email || !password) {
        alert("All fields must be filled out");
        return;
    }

    let data = JSON.stringify({ name, email, password });

    xhr.send(data);
    xhr.onload = function () {
        if (xhr.status === 201) {
            alert("Registration successful, please log in.");
            // Redireccionar al modal de Log In
            ShowLogIn();
        } else {
            alert("Failed to register: " + JSON.parse(xhr.responseText).message);
        }
    };
    xhr.onerror = function () {
        alert("An error occurred during the registration process.");
    };
}

function login(event) {
    event.preventDefault(); // Detiene el envío normal del formulario

    const email = document.getElementById("emailInputLogin").value;
    const password = document.getElementById("passwordInputLogin").value;

    fetch('/user/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.token) {
            sessionStorage.setItem("UserValidation", data.token);
            alert("Login successful!");
            window.location.href = "http://localhost:3000/profile";
        } else {
            alert("Login failed: " + data.message);
        }
    })
    .catch(error => {
        console.error('Error during login:', error);
        alert("Login failed, please try again.");
    });
}

// function ShowUserInfo(){
//     let xhr = new XMLHttpRequest();
//     let UserInfo = document.getElementById("UserInfo");
//     xhr.open('GET','/user/info',true);
//     xhr.setRequestHeader('Content-Type','application/json');
//     xhr.setRequestHeader('x-token',sessionStorage.getItem("UserValidation"));
//     xhr.send();
//     xhr.onload = function(){
//         if(xhr.status == 200){
//             let user = JSON.parse(xhr.responseText);
//             console.table(user);
//             UserInfo.innerHTML = "\
//             <div class=\"tab-content\">\
//                 <table class=\"table table-bordered table-hover\">\
//                     <tbody>\
//                         <tr>\
//                             <td>Nombre</td>\
//                             <td class='data' id='name'>"+user.name+"</td>\
//                         </tr>\
//                         <tr>\
//                             <td>Correo</td>\
//                             <td class='data'  id='email'>"+user.email+"</td>\
//                         </tr>\
//                         <tr>\
//                             <td>Fecha de nacimiento</td>\
//                             <td class='data' id='date'>"+user.date+"</td>\
//                         </tr>\
//                         <tr>\
//                             <td>Descripcion</td>\
//                             <td class='data' id='description'>"+user.description+"</td>\
//                         </tr>\
//                         <tr>\
//                             <td>Ciudad</td>\
//                             <td class='data' id='city'>"+user.city+"</td>\
//                         </tr>\
//                         <tr>\
//                             <td>Estado</td>\
//                             <td class='data'  id='state'>"+user.state+"</td>\
//                         </tr>\
//                         <tr>\
//                             <td>Pais</td>\
//                             <td class='data' id='country'>"+user.country+"</td>\
//                         </tr>\
//                         <tr>\
//                             <td>Telefono</td>\
//                             <td class='data' id='phone'>"+user.phone+"</td>\
//                         </tr>\
//                     </tbody>\
//                 </table>\
//             </div>";
//             document.getElementById("user_pic").innerHTML = `<img alt="User Pic" src="${user.image}" class="img-fluid rounded-circle" style="max-width: 150px;">`;
//         }
//         else{
//             alert("Debe iniciar sesion para ver su informacion");
//             window.location.href = "http://localhost:3000/user/login";
//         }
//     }
// }

// function EditUser(){
//     let editbutton = document.getElementById("editbutton");
//     editbutton.innerHTML = "\
//     <div class=\"input-group-append\">\
//     <button class=\"btn btn-info\" type=\"button\" onclick=\"SaveUserInfo()\"><i class=\"fa fa-save icon\"></i></button>\
//     <button class=\"btn btn-danger\" type=\"button\" onclick=\"CancelEdit()\"><i class=\"fa fa-times icon\"></i></button>\
//     </div>";
//     let data = document.getElementsByClassName("data");
//     for(let i = 0; i < data.length; i++){
//         data[i].setAttribute("contenteditable","true");
//     }
// }

// function CancelEdit(){
//     let editbutton = document.getElementById("editbutton");
//     editbutton.innerHTML = "\
//     <div class=\"input-group-append\">\
//     <button type='button' class='btn btn-primary btn-block' onclick='EditUser()'>Editar perfil</button>\
//     </div>";
//     let data = document.getElementsByClassName("data");
//     for(let i = 0; i < data.length; i++){
//         data[i].setAttribute("contenteditable","false");
//     }
// }

// function SaveUserInfo(){
//     let xhr = new XMLHttpRequest();
//     xhr.open('PUT','/user/info',true);
//     xhr.setRequestHeader('Content-Type','application/json');
//     xhr.setRequestHeader('x-token',sessionStorage.getItem("UserValidation"));
//     let name = document.getElementById("name").innerText;
//     let email = document.getElementById("email").innerText;
//     let date = document.getElementById("date").innerText;
//     let description = document.getElementById("description").innerText;
//     let city = document.getElementById("city").innerText;
//     let state = document.getElementById("state").innerText;
//     let country = document.getElementById("country").innerText;
//     let phone = document.getElementById("phone").innerText;
//     let data = "{\"name\":\""+name+"\",\"email\":\""+email+"\",\"date\":\""+date+"\",\"description\":\""+description+"\",\"city\":\""+city+"\",\"state\":\""+state+"\",\"country\":\""+country+"\",\"phone\":\""+phone+"\"}";
//     console.table(JSON.parse(data));
//     xhr.send(data);
//     editbutton.innerHTML = "\
//     <div class=\"input-group-append\">\
//     <button type='button' class='btn btn-primary btn-block' onclick='EditUser()'>Editar perfil</button>\
//     </div>";
//     xhr.onload = function(){
//         if(xhr.status == 200){
//             alert("Informacion actualizada correctamente");
//             ShowUserInfo();
//         }
//         else{
//             alert("Error al actualizar informacion");
//         }
//     }
// }

// function NavBar(){
//     xhr = new XMLHttpRequest();
//     xhr.open('GET','/user/type',true);
//     let validate = sessionStorage.getItem("UserValidation");
//     xhr.setRequestHeader('x-token',validate);
//     xhr.send();
//     xhr.onload = function(){
//     let nav = document.getElementById("nav");
//     if(xhr.status == 200){
//         let type = xhr.responseText;
//         if(type == "Vendedor"){
//             nav.innerHTML = "\
//             <nav class=\"navbar navbar-dark navbar-expand-sm\" style=\"background-color: green;\">\
//             <div class=\"container\">\
//                 <a class=\"navbar-brand\" href=\"http://localhost:3000/home\"><i class=\"fa fa-home icon\"></i></a>\
//                 <button class=\"navbar-toggler d-lg-none\" type=\"button\" data-bs-toggle=\"collapse\" data-bs-target=\"#collapsibleNavId\" aria-controls=\"collapsibleNavId\"\
//                     aria-expanded=\"false\" aria-label=\"Toggle navigation\">\
//                     <span class=\"navbar-toggler-icon\"></span>\
//                 </button>\
//                 <div class=\"collapse navbar-collapse\" id=\"collapsibleNavId\">\
//                     <ul class=\"navbar-nav me-auto mt-2 mt-lg-0\">\
//                         <li class=\nav-item\">\
//                         <a class=\"nav-link active\" href=\"http://localhost:3000/AddHome\" aria-current=\"page\">Vender<span class=\"visually-hidden\">(current)</span></a>\
//                         </li>\
//                     </ul>\
//                     <ul class=\"navbar-nav ml-auto mt-2 mt-lg-0 justify-content-end\" style=\"float: right;\">\
//                         <li class=\"nav-item\">\
//                             <a class=\"nav-link active\" href=\"http://localhost:3000/user/profile\" aria-current=\"page\"><i class='fa fa-star icon'></i><span class=\"visually-hidden\">(current)</span></a>\
//                         </li>\
//                         <li class=\"nav-item\">\
//                             <a class=\"nav-link active\" href=\"http://localhost:3000/user/profile\" aria-current=\"page\"><i class='fa fa-user-circle icon'></i><span class=\"visually-hidden\">(current)</span></a>\
//                         </li>\
//                         <li class=\"nav-item\">\
//                             <a class=\"nav-link active\" href=\"javascript:logout()\" aria-current=\"page\"><i class='fa fa-sign-out icon'></i><span class=\"visually-hidden\">(current)</span></a>\
//                         </li>\
//                     </ul>\
//                 </div>\
//         </div>\
//         </nav>";
//         }
//         else{
//             nav.innerHTML = "\
//             <nav class=\"navbar navbar-dark navbar-expand-sm\" style=\"background-color: blue;\">\
//             <div class=\"container\">\
//                 <a class=\"navbar-brand\" href=\"http://localhost:3000/home\"><i class=\"fa fa-home icon\"></i></a>\
//                 <button class=\"navbar-toggler d-lg-none\" type=\"button\" data-bs-toggle=\"collapse\" data-bs-target=\"#collapsibleNavId\" aria-controls=\"collapsibleNavId\"\
//                     aria-expanded=\"false\" aria-label=\"Toggle navigation\">\
//                     <span class=\"navbar-toggler-icon\"></span>\
//                 </button>\
//                 <div class=\"collapse navbar-collapse\" id=\"collapsibleNavId\">\
//                     <ul class=\"navbar-nav me-auto mt-2 mt-lg-0\">\
//                         <li class=\nav-item\">\
//                         <a class=\"nav-link active\" href=\"http://localhost:3000/Search\" aria-current=\"page\">Comprar<span class=\"visually-hidden\">(current)</span></a>\
//                         </li>\
//                     </ul>\
//                     <ul class=\"navbar-nav ml-auto mt-2 mt-lg-0 justify-content-end\" style=\"float: right;\">\
//                         <li class=\"nav-item\">\
//                             <a class=\"nav-link active\" href=\"javascript:MyWhishList()\" aria-current=\"page\"><i class='fa fa-star icon'></i><span class=\"visually-hidden\">(current)</span></a>\
//                         </li>\
//                         <li class=\"nav-item\">\
//                             <a class=\"nav-link active\" href=\"http://localhost:3000/user/profile\" aria-current=\"page\"><i class='fa fa-user-circle icon'></i><span class=\"visually-hidden\">(current)</span></a>\
//                         </li>\
//                         <li class=\"nav-item\">\
//                             <a class=\"nav-link active\" href=\"javascript:logout()\" aria-current=\"page\"><i class='fa fa-sign-out icon'></i><span class=\"visually-hidden\">(current)</span></a>\
//                         </li>\
//                     </ul>\
//                 </div>\
//         </div>\
//         </nav>";
//     }
// }
// }
// }

// function logout(){
//     sessionStorage.removeItem("UserValidation");
//     alert("Sesion cerrada correctamente");
//     window.location.href = "http://localhost:3000/home";
// }

// function DeleteUser(){
//     let xhr = new XMLHttpRequest();
//     xhr.open('DELETE','/user/info',true);
//     xhr.setRequestHeader('Content-Type','application/json');
//     xhr.setRequestHeader('x-token',sessionStorage.getItem("UserValidation"));
//     xhr.send();
//     xhr.onload = function(){
//         if(xhr.status == 200){
//             alert("Usuario eliminado correctamente");
//             logout();
//         }
//         else{
//             alert("Error al eliminar usuario");
//         }
//     }
// }

// function MyWhishList(){
//     sessionStorage.setItem("WishList","true");
//     window.location.href = "http://localhost:3000/search";
// }