function UPDUP() {
    console.log("Entro a la funcion");
    let token = sessionStorage.getItem("user");
    token = JSON.parse(token);
    console.log(token)
    console.log(token._id)
    if (!token) {
        alert("Please log in first");
        window.location.href = "/login";
        return;
    }

    // Hacer la solicitud para obtener la información del usuario
    let userXhr = new XMLHttpRequest();
    userXhr.open('GET', '/user/info', true);
    userXhr.setRequestHeader('Content-Type', 'application/json');
    userXhr.setRequestHeader('Authorization', `Bearer ${token._id}`);
    console.log("Enviando solicitud de información del usuario")
    userXhr.send();

    userXhr.onload = function () {
        if (userXhr.status == 200) {
            const user = JSON.parse(userXhr.responseText);
            console.log("Información del usuario obtenida:", user);
            // Crear sección para mostrar la información del usuario
            const userSection = `
                <section aria-labelledby="signUp" role="region">
                    <h1 class="username">YOUR PROFILE</h1>
                    <h6 style="padding-left: 50px;">Manage how other users see you</h6>
                    <h2 class="username">${user.name}</h2>
                    <div class="profile-info">
                        <div class="image-container">
                            <img src="${user.image}">
                            <br>
                            <button type="button" class="edit-button">Edit</button>
                        </div>
                        <div class="text-container">
                            <p>${user.description}</p>
                            <button type="button" class="edit-button">Edit</button>
                        </div>
                    </div>
                </section>`;
            // Mostrar la sección de información del usuario
            document.getElementById("fill_with_info").innerHTML = userSection;
        } else {
            console.error("Failed to fetch user profile:", userXhr.statusText);
            alert("Failed to fetch profile information.");
        }
    };

    // Hacer la solicitud para obtener la información de la receta
    let recipeXhr = new XMLHttpRequest();
    recipeXhr.open('GET', '/recipes/info', true);
    recipeXhr.setRequestHeader('Content-Type', 'application/json');
    recipeXhr.setRequestHeader('Authorization', `Bearer ${token._id}`);
    console.log("Enviando solicitud de información de la receta")
    recipeXhr.send();

    recipeXhr.onload = function () {
        if (recipeXhr.status == 200) {
            const recipes = JSON.parse(recipeXhr.responseText);
            console.log("Información de la receta obtenida:", recipes);
            // Crear sección para mostrar la información de la receta

            let recipesCard = "";
        
            recipes.forEach((recipe) => {         
                recipesCard += `
                <div class="profile-info" key="${recipe._id}">
                    <div class="image-container">
                        <img src="${recipe.image}">
                    </div>
                    <div class="text-container2">
                        <h1 onclick="redirectToRecipe('${recipe._id}')">${recipe.name}</h1>
                        <p>${recipe.description}</p>
                        <button type="button" id="blackbutton">Manage</button>
                    </div>
                </div> `;
            });

            const recipeSection = `
            <section aria-labelledby="recipes" role="region">
                <h1 class="username">POSTED RECIPES</h1>
                ${recipesCard}
            </section>`;


            // Mostrar la sección de información de la receta
            document.getElementById("fill_with_info").innerHTML += recipeSection;
        } else {
            console.error("Failed to fetch recipe information:", recipeXhr.statusText);
            alert("Failed to fetch recipe information.");
            window.location.href = "/recipes";
        }
    };
}



// function UPDUP() {
//     console.log("Entro a la funcion");
//     let token = sessionStorage.getItem("user");
//     token = JSON.parse(token);
//     console.log(token)
//     console.log(token._id)
//     if (!token) {
//         alert("Please log in first");
//         window.location.href = "/login";
//         return;
//     }
//     let xhr = new XMLHttpRequest();
//     xhr.open('GET', '/user/info', true);
//     xhr.setRequestHeader('Content-Type', 'application/json');
//     xhr.setRequestHeader('Authorization', `Bearer ${token._id}`);
//     console.log("Enviando")
//     xhr.send();
//     xhr.onload = function () {
//         if (xhr.status == 200) {
//             const user = JSON.parse(xhr.responseText);
//             console.log("Atributos objeto:", xhr.responseText);
//             console.table(user);
//             const profileSection = `
//         <section aria-labelledby="signUp" role="region">
//             <h1 class="username">YOUR PROFILE</h1>
//             <h6 style="padding-left: 50px;">Manage how other users see you</h6>
//             <h2 class="username">${user.name}</h2>
//             <div class="profile-info">
//                 <div class="image-container">
//                     <img src="${user.image}">
//                     <br>
//                     <button type="button" class="edit-button">Edit</button>
//                 </div>
//                 <div class="text-container">
//                     <p>${user.description}</p>
//                     <button type="button" class="edit-button" style="margin-left: -100px;">Edit</button>
//                 </div>
//             </div>
//         </section>`;
//             document.getElementById("fill_with_info").innerHTML = profileSection;
//         } else {
//             console.log(xhr.status)
//             console.error("Failed to fetch user profile:", xhr.statusText);
//             alert("Failed to fetch profile information.");
//         }
//     };
//     xhr.open('GET', '/new_recipe/info', true);
//     xhr.setRequestHeader('Content-Type', 'application/json');
//     xhr.setRequestHeader('Authorization', `Bearer ${token._id}`);
//     console.log("Enviando")
//     xhr.send();
//     xhr.onload = function () {
//         if (xhr.status == 200) {
//             const user = JSON.parse(xhr.responseText);
//             console.log("Atributos objeto:", xhr.responseText);
//             console.table(user);
//             const profileSection = `
//             <section aria-labelledby="signUp" role="region">
//             <h1 class="username">POSTED RECIPES</h1>
//             <div class="profile-info">
//             <div class="image-container">
//                 <img
//                     src="https://images.unsplash.com/photo-1593231060852-5f040ae7df82?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Y2hvY28lMjBjaGlwJTIwY29va2llc3xlbnwwfHwwfHx8Mg%3D%3D">
//             </div>
//             <div class="text-container2">
//                 <h1>CHOCO CHIP COOKIES</h1>
//                 <p>Classic flavorful cookies with a small change... No sugar! Enjoy this
//                     chocolate chip cookies with no guilt and share with those who might
//                     prefer a healthy delicious option
//                 </p>
//                 <button type="button" id="blackbutton" style="margin-left: -100px;">Manage</button>
//                 <div class="button-container">
//                     <button type="button" class="edit-button">Cookies</button>
//                     <button type="button" class="edit-button">No sugar</button>
//                     <button type="button" class="edit-button">Low skill</button>
//                 </div>
//             </div>
//         </div>
//         </section>`;
//             document.getElementById("fill_with_info").innerHTML = profileSection;
//         } else {
//             console.log(xhr.status)
//             console.error("Failed to fetch user profile:", xhr.statusText);
//             alert("Failed to fetch profile information.");
//         }
//     };

// }