function postRecipe() {
    // Recolecta los datos del formulario
    const name = document.querySelector('input[name="name"]').value;
    const description = document.querySelector('textarea[name="description"]').value;
    const ingredients = document.querySelector('textarea[name="ingredients"]').value;
    const instructions = document.querySelector('textarea[name="instructions"]').value;
    const image = document.querySelector('input[name="image"]').value;
    const tagsInput = document.querySelector('input[name="tags"]').value;
    const tags = tagsInput.split(',').map(tag => tag.trim());
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
        tags: tags,
        owner: owner
    };

    // Convierte el objeto en formato JSON
    const jsonData = JSON.stringify(data);
    // Realiza la solicitud XMLHttpRequest para enviar los datos del formulario
    let xhr = new XMLHttpRequest();
    console.log(jsonData)
    xhr.open('POST', '/new_recipe/recipes', true); 
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

document.addEventListener('DOMContentLoaded', function() {
    const tags = new Bloodhound({
        datumTokenizer: Bloodhound.tokenizers.whitespace,
        queryTokenizer: Bloodhound.tokenizers.whitespace,
        remote: {
            url: '/new_recipe/find_tags?q=%QUERY',
            wildcard: '%QUERY'
        }
    });

    $('#tags-input').typeahead({
        minLength: 1,
        highlight: true
    }, {
        name: 'tags',
        source: tags
    });

    $('#tags-input').bind('typeahead:select', function(ev, suggestion) {
        console.log('Selected:', suggestion);
    });
});