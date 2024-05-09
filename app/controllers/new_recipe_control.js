const form = document.querySelector('form');

document.querySelector('form').addEventListener('submit', function(event) {
    event.preventDefault(); // Evita que el formulario se envíe de la manera tradicional
    const formData = new FormData(this);

    console.log(formData, event)

    /*fetch('/recipes', {
        method: 'POST',
        body: formData, // FormData maneja el Content-Type automáticamente
        credentials: 'include' 
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        console.log('Success:', data);
        alert('Recipe created successfully!');
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Failed to create recipe');
    });*/
});

form.addEventListener('submit', function(event) {
    event.preventDefault();
    const formData = new FormData(form);

    console.log(formData, event)
     /*fetch('/recipes', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error('Error:', error));*/
});