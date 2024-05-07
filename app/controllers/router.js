const express = require('express');
const path = require('path');
const usersRouter = require('../routes/users'); //NUEVA
const router = express.Router();

function validateAdmin(req, res, next) {
    if (req.get('x-token') == 'admin') {
        next();
    } else {
        res.status(403).send('Acesso no autorizado no se cuenta con privilegios de administrador')
    }
}

router.use('/user', usersRouter);

router.get('/',(req,res) => res.sendFile(path.resolve(__dirname + "/../views/home.html")));
router.get('/home',(req,res) => res.sendFile(path.resolve(__dirname + "/../views/home.html")));
router.get('/userprofile',(req,res) => res.sendFile(path.resolve(__dirname + "/../views/userprofile.html")));
router.get('/views/user/?',(req,res) => res.sendFile(path.resolve(__dirname + "/../views/userprofile.html")));


module.exports = router;