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

// Ruta base para enviar al home
router.get('/',(req,res) => res.sendFile(path.resolve(__dirname + "/../views/home.html")));
router.get('/home',(req,res) => res.sendFile(path.resolve(__dirname + "/../views/home.html")));

// Ruta para el perfil de usuario
router.get('/profile', (req, res) => {
    // Verificar si el usuario está autenticado antes de enviar el perfil
    if (!req.headers.authorization) {
        res.redirect('/login'); // Redirige al login si no está autenticado
    } else {
        res.sendFile(path.resolve(__dirname, "../views/userprofile.html"));
    }
});

// router.get('/views/user/?',(req,res) => res.sendFile(path.resolve(__dirname + "/../views/userprofile.html")));

// Ruta para crear receta nueva
router.get('/new_recipe',(req,res) => {
    // Verificar si el usuario está autenticado antes de enviar el perfil
    if (!req.headers.authorization) {
        res.redirect('/login'); // Redirige al login si no está autenticado
    } else {
        res.sendFile(path.resolve(__dirname, "../views/userprofile.html"));
    }
});

// Ruta para ver una receta específica
router.get('/recipe/',(req,res) => res.sendFile(path.resolve(__dirname + "/../views/recipe.html")));

module.exports = router;