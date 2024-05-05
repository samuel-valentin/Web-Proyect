const express = require('express');
const path = require('path');
const productRouter = require('../routes/products');
const adminProductRouter = require('../routes/admin_products');
const usersRouter = require('../routes/users'); //NUEVA
const router = express.Router();

function validateAdmin(req, res, next) {
    if (req.get('x-token') == 'admin') {
        next();
    } else {
        res.status(403).send('Acesso no autorizado no se cuenta con privilegios de administrador')
    }
}

router.use('/products', productRouter);
router.use('/admin/products', validateAdmin, adminProductRouter);
router.use('/user', usersRouter);

router.get('/',(req,res) => res.sendFile(path.resolve(__dirname + "/../views/home.html")));
router.get('/home',(req,res) => res.sendFile(path.resolve(__dirname + "/../views/home.html")));
router.get('/shopping_cart',(req,res) => res.sendFile(path.resolve(__dirname + "/../views/shopping_cart.html")));
router.get('/admin',(req,res) => res.sendFile(path.resolve(__dirname + "/../views/admin.html")));

module.exports = router;