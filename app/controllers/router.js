const express = require('express');
const path = require('path');
const usersRouter = require('../routes/users'); //NUEVA
const recipesRouter = require('../routes/new_recipe')

const router = express.Router();

// Middleware para validar si el usuario es admin
function validateAdmin(req, res, next) {
    if (req.get('x-token') == 'admin') {
        next();
    } else {
        res.status(403).send('Acesso no autorizado no se cuenta con privilegios de administrador')
    }
}

// Usar el router de usuarios para todas las rutas bajo '/user'
router.use('/user', usersRouter);
router.use('/favorites', usersRouter);
// Usar el router de recetas para todas las rutas bajo '/new_recipe'
router.use('/new_recipe', recipesRouter);
router.use('/recipe/:id', recipesRouter);
router.use('/recipes', recipesRouter);
router.use('/tags', recipesRouter);

// Ruta base para enviar al home
router.get('/',(req,res) => res.sendFile(path.resolve(__dirname + "/../views/home.html")));
router.get('/home',(req,res) => res.sendFile(path.resolve(__dirname + "/../views/home.html")));
router.get('/views/user/?',(req,res) => res.sendFile(path.resolve(__dirname + "/../views/user_profile.html")));

// Ruta para el perfil de usuario
router.get('/profile', (req, res) => {
    // Verificar si el usuario está autenticado antes de enviar el perfil
    // if (req.headers.authorization) {
    //    return res.redirect('/home'); // Redirige al login si no está autenticado
   // } else {
        return res.sendFile(path.resolve(__dirname + "/../views/user_profile.html"));
    //}
});


// router.get('/views/user/?',(req,res) => res.sendFile(path.resolve(__dirname + "/../views/user_profile.html")));

// Ruta para crear receta nueva
router.get('/new_recipe',(req,res) => {
    // Verificar si el usuario está autenticado antes de enviar el perfil
    // if (!req.headers.authorization) {
    // res.redirect('/home'); // Redirige al login si no está autenticado
    //} else {
       return res.sendFile(path.resolve(__dirname +  "/../views/new_recipe.html"));
    //}
});

// Ruta para ver una receta específica
router.get('/recipe/:id',(req,res) => {return res.sendFile(path.resolve(__dirname + "/../views/recipe.html"))});
// Ruta para explorar todas las recetas
router.get('/recipes',(req,res) => {return res.sendFile(path.resolve(__dirname + "/../views/recipe_explorer.html"))});


module.exports = router;