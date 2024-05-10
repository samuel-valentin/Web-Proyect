function postRecipe() {
    // Recolecta los datos del formulario
    const name = document.querySelector('input[name="name"]').value;
    const description = document.querySelector('textarea[name="description"]').value;
    const ingredients = document.querySelector('textarea[name="ingredients"]').value;
    const instructions = document.querySelector('textarea[name="instructions"]').value;
    const image = document.querySelector('input[name="image"]').value;
    // Obtiene el valor del campo oculto "owner"
    let owner = sessionStorage.getItem("user");
    owner = JSON.parse(owner);
    console.log(owner)
    console.log(owner._id)
    console.log("Owner", owner)
    // Crea un objeto FormData para enviar los datos
    const data = {
        name: name,
        description: description,
        image: image,
        ingredients: ingredients,
        instructions: instructions,
        owner: owner
    };

    // Convierte el objeto en formato JSON
    const jsonData = JSON.stringify(data);
    // Realiza la solicitud XMLHttpRequest para enviar los datos del formulario
    let xhr = new XMLHttpRequest();
    console.log(jsonData)
    xhr.open('POST', '/new_recipe/recipe', true); // Asegúrate de que la URL sea la correcta
    xhr.setRequestHeader('Content-Type','application/json');
    xhr.send(jsonData);
    xhr.onload = function() {
        if (xhr.status === 201) {
            console.log('Registro exitoso');
            window.location.href = '/profile';
        } else {
            console.error('Error en el registro: ' + xhr.responseText);
        }
    };
    
}