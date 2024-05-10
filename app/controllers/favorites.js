function fetchRecipes() {
    fetch('/recipes') 
    .then(response => response.json())
    .then(recipes => {
        const container = document.getElementById('recipes-container');
        recipes.forEach(recipe => {
            const recipeCard = `<div class="col-md-3">
                                    <div class="card">
                                        <img src="${recipe.image}" class="card-img-top" alt="${recipe.name}">
                                        <div class="card-body">
                                            <h5 class="card-title">${recipe.name}</h5>
                                            <a href="recipe.html?id=${recipe._id}" class="btn btn-primary">View Recipe</a>
                                        </div>
                                    </div>
                                </div>`;
            container.innerHTML += recipeCard;
        });
    });
}


function addFavorite(recipeId) {
    fetch('/user/favorites', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + sessionStorage.getItem("UserValidation")
        },
        body: JSON.stringify({ recipeId })
    })
    .then(response => response.json())
    .then(data => alert(data.message))
    .catch(error => console.error('Error adding to favorites:', error));
}

function removeFavorite(recipeId) {
    fetch('/user/favorite', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + sessionStorage.getItem("UserValidation")
        },
        body: JSON.stringify({ recipeId })
    })
    .then(response => response.json())
    .then(data => alert(data.message))
    .catch(error => console.error('Error removing from favorites:', error));
}
