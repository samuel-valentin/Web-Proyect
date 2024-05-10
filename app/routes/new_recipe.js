const mongoose = require('mongoose');
const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();

mongoose.connect('mongodb+srv://oscarchiw:HomeBakesDASW@daswproject.ur4wdy7.mongodb.net/HomeBakes')

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("Connected successfully to MongoDB");
});

router.get('/recipes',(req,res) => res.sendFile(path.resolve(__dirname + "/../views/new_recipe.html")));

// Esquema y modelo de Mongoose
const recipeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    ingredients: { type: String, required: true },
    instructions: { type: String, required: true },
    owner: { type: String, required: true }
});

const Recipe = mongoose.model('Recipe', recipeSchema);

// Ruta POST para crear una receta
router.post('/recipe', async (req, res) => {
    console.log("REQ BODY:", req.body)
    try {
        const { name, description, image, ingredients, instructions, owner } = req.body;
        const recipe = new Recipe({
            name,
            description,
            image,
            ingredients,
            instructions,
            owner
        });
        await recipe.save();
        res.status(201).send({ message: "Recipe created successfully", recipeId: recipe._id });
    } catch (error) {
        console.error('Recipe creation failed:', error);
        res.status(500).send({ message: "Error creating recipe" });
    }
});


router.get('/info', async(req,res) => {
        try {
            // Extraer el token de autorización del encabezado de la solicitud
            const token = req.headers['authorization']?.split(' ')[1];
            console.log("Token dentro del get info:", token);
    
            // Buscar las recetas del usuario
            const recipes = await Recipe.find({ owner: token });
            console.log("Recetas encontradas: ",recipes)

            // Verificar si se encontraron recetas
            if (recipes.length === 0) {
                return res.status(404).send({ message: "No recipes found for this user" });
            }
    
            // Envía las recetas encontradas como respuesta
            res.status(200).send(recipes);
        } catch (error) {
            console.error('Failed to fetch recipe information:', error);
            res.status(500).send({ message: "Error fetching recipe information" });
        }
    


    // console.log("Info working!");
    // let = token = req.headers['authorization']?.split(' ')[1];
    // console.log("REQ BODY DEL GET:", req.body)
    // console.log("Token: ",token)
    // console.log("ID ",token._id)
    // mongoose.model('users').findOne({_id: token}).then((user) => {
    //     if(user == null){
    //         res.sendStatus(404);
    //     }
    //     else{
    //         res.status(200).send(user);
    //     }
    // });
});

module.exports = router;