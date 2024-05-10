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

router.get('/new_recipe',(req,res) => res.sendFile(path.resolve(__dirname + "/../views/new_recipe.html")));

// Esquema y modelo de las recetas para Mongoose
const recipeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    ingredients: { type: String, required: true },
    instructions: { type: String, required: true },
    tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }],
    owner: { type: String, required: true }
});

const Recipe = mongoose.model('Recipe', recipeSchema);

// Esquema y modelo de los tags para Mongoose
const tagSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true }
});

const Tag = mongoose.model('Tag', tagSchema);

router.get('/recipes', async (req, res) => {
    try {
        const recipes = await Recipe.find({}); 
        res.json(recipes);
    } catch (error) {
        console.error("Failed to fetch recipes:", error);
        res.status(500).send({ message: "Failed to fetch recipes" });
    }
});

// Ruta POST para crear una receta
router.post('/recipes', async (req, res) => {
    console.log("se creo la receta")
    try {
        const { name, description, image, ingredients, instructions, tags, owner } = req.body;

        // Manejar los tags: buscar si existen o crear nuevos
        const tagsDocs = await Promise.all(tags.map(async tag => {
            let tagDoc = await Tag.findOne({ name: tag });
            if (!tagDoc) {
                tagDoc = new Tag({ name: tag });
                await tagDoc.save();
            }
            return tagDoc._id;
        }));

        const recipe = new Recipe({
            name,
            description,
            image,
            ingredients,
            instructions,
            tags: tagsDocs,
            owner
        });
        await recipe.save();
        res.status(201).send({ message: "Recipe created successfully", recipeId: recipe._id });
    } catch (error) {
        console.error('Recipe creation failed:', error);
        res.status(500).send({ message: "Error creating recipe" });
    }
});

router.get('/recipe/:id', async (req, res) => {
    console.log("Accediendo a la ruta con ID:", req.params.id);
    try {
        const recipe = await Recipe.findById(req.params.id);
        if (recipe) {
            res.status(200).json(recipe);
        } else {
            res.status(404).send('Receta no encontrada');
        }
    } catch (error) {
        console.error("Error en la base de datos:", error);
        res.status(500).send({ message: "Error al obtener la receta", error: error.message });
    }
});

router.get('/search_recipes', async (req, res) => {
    try {
        const { searchQuery } = req.query;
        const recipes = await Recipe.find({
            $or: [
                { name: { $regex: searchQuery, $options: 'i' } },
                { description: { $regex: searchQuery, $options: 'i' } }
            ]
        });
        res.json(recipes);
    } catch (error) {
        console.error("Failed to fetch recipes:", error);
        res.status(500).send({ message: "Failed to fetch recipes" });
    }
});

// Obtener todos los tags
router.get('/tags', async (req, res) => {
    try {
        const tags = await Tag.find({});
        res.json(tags);
    } catch (error) {
        res.status(500).send({ message: "Error al obtener los tags", error: error.message });
    }
});

// Ruta para encontrar tags en la colección de MongoDB
router.get('/tags', async (req, res) => {
    const query = req.query.q;
    const tagsCollection = db.collection('tags');
    const tags = await tagsCollection.find({ name: { $regex: query, $options: 'i' } }).toArray();
    res.json(tags.map(tag => tag.name));
});

// Agregar un nuevo tag
router.post('/tags', async (req, res) => {
    const { name } = req.body;
    const tagsCollection = db.collection('tags');
    const result = await tagsCollection.insertOne({ name });
    res.status(201).json({ message: 'Tag added', tagId: result.insertedId });
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

// Ruta para obtener la receta
router.get('/recipe/info/:id', async (req, res) => {
    console.log('AQUI[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[', res)
    try {
        const recipe = await Recipe.findById({ id: req.params.id });
        console.log(recipe);
        if (recipe) {
            res.status(200).json(recipe);
        } else {
            res.status(404).send('Receta no encontrada');
        }
    } catch (error) {
        res.status(500).send({ message: "Error fetching recipes by id", error: error.message });
    }
});

// Ruta para filtrar por tag
router.get('/recipes/:tagId', async (req, res) => {
    try {
        const recipes = await Recipe.find({ tags: req.params.tagId }).populate('tags');
        res.status(200).json(recipes);
    } catch (error) {
        res.status(500).send({ message: "Error fetching recipes by tag", error: error.message });
    }
});

module.exports = router;