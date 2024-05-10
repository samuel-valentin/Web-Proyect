
function displayRecipe(recipe) {
    // Actualizar la imagen de la receta
    document.getElementById("recipeImage").innerHTML = `<img class="selected-product" src="${recipe.image}" alt="${recipe.name}" style="width: 100%; height: 100%;
    object-fit: cover;">`;

    // Actualizar el título de la receta
    document.getElementById("title").textContent = recipe.name;

    // Actualizar el creador de la receta (si aplica)
    document.getElementById("username").textContent = recipe.owner;

    // Actualizar las etiquetas (tags), aquí se asume que la receta tiene un array de tags
    const tagsContainer = document.getElementById("tangs");
    tagsContainer.innerHTML = recipe.tags.map(tag => `<button class="tag">${tag}</button>`).join('');

    // Actualizar los ingredientes
    const ingredientList = document.getElementById("ingredientList");
    const ingredients = recipe.ingredients.split(',');
    ingredientList.innerHTML = ingredients.map(ingredient => `<li>${ingredient}</li>`).join('');

    // Actualizar las instrucciones
    const description = document.getElementById("description");

    const instructions = recipe.instructions.split('*');
    description.innerHTML = instructions.map(step => `<li>${step}</li>`).join('');
}

function getRecipeIdFromUrl() {
    const path = window.location.pathname; 
    const pathSegments = path.split('/'); 
    const recipeId = pathSegments.pop() || pathSegments.pop(); 
    return recipeId;
}

function getRecipeById(recipeId) {
    console.log("Fetching recipe with ID:", recipeId);

    let xhr = new XMLHttpRequest();
    xhr.open('GET', `/new_recipe/recipe/${recipeId}`, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send();

    xhr.onload = function () {
        if (xhr.status == 200) {
            const recipe = JSON.parse(xhr.responseText);
            console.log("Recipe information obtained:", recipe);
            displayRecipe(recipe);
        } else {
            console.error("Failed to fetch recipe:", xhr.statusText);
            alert("Failed to fetch recipe information.");
        }
    };

    xhr.onerror = function () {
        console.error("Request failed");
        alert("An error occurred during the request.");
    };
}

function fetchAndDisplayRecipe() {
    const recipeId = getRecipeIdFromUrl();

    if (recipeId) {
        getRecipeById(recipeId);
    } else {
        console.error("No recipe ID found in the URL");
    }
}
