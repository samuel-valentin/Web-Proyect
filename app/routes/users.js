const mongoose = require('mongoose');
const express = require('express');
const bcrypt = require('bcrypt');
const path = require('path');
const utils = require('../controllers/utils');
const { read } = require('fs');
const router = express.Router();
let app = express();

mongoose.connect('mongodb+srv://oscarchiw:HomeBakesDASW@daswproject.ur4wdy7.mongodb.net/HomeBakes')


const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("Connected successfully to MongoDB");
});

router.get('/home',(req,res) => res.sendFile(path.resolve(__dirname + "/../views/home.html")));
router.get('/register',(req,res) => res.sendFile(path.resolve(__dirname + "/../views/registro.html")));
router.get('/login',(req,res) => res.sendFile(path.resolve(__dirname + "/../views/login.html")));
router.get('/profile',(req,res) => res.sendFile(path.resolve(__dirname + "/../views/userprofile.html")));


// Ruta para la visualización de la página de perfil
router.get('/',(req,res) => {
    res.sendFile(path.resolve(__dirname + "/../views/userprofile.html"));
});

const userSchema = new mongoose.Schema({
    name: { type: String },
    email: { type: String},
    password: { type: String},
    description: { type: String, default: 'Tell us about you!' },
    image: { type: String, default: 'https://images.unsplash.com/photo-1466921583968-f07aa80c526e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aW5jb2duaXRvfGVufDB8fDB8fHwy' }
});

var User = mongoose.model('users', userSchema);

router.get('/info',(req,res) => {
    console.log("Info working!");
    let token = req.headers['x-token'];
    console.log("Token: " + token);
    mongoose.model('users').findOne({ID: token}).then((user) => {
            res.status(200).send(user);
    });
});

router.post('/home',(req,res) => {
    console.log("Register working!");
    let x = req.body;
    console.log("Body: " + x);
    console.log("Password: " + x.password);
    let hash = bcrypt.hashSync(x.password,10);
    console.log("Hash: " + hash);
    let correct_password = bcrypt.compareSync(x.password,hash);
    console.log("Correct password: " + correct_password);
    let y = Object.values(x);
    console.log("Array" + y);
    if(!y.length)
    {
        res.sendStatus(400);
    }
    else{
            mongoose.model('users').findOne({email: x.email}).then((user) => {
                if(user != null){
                    res.sendStatus(409);
                }
                else{
                    let user = new User({
                        ID: utils.generateUUID(),
                        name: x.name,
                        email: x.email,
                        password: hash,
                        description: x.description,
                        image: x.image
                    });
                    console.log("User: ");
                    console.table(user);
                    user.save();
                    res.status(200).send(user.ID);
                }
            });
        }
});

// router.post('/login', async (req, res) => {
//     const { email, password } = req.body;
//     const user = await User.findOne({ email });

//     if (!user || !(await bcrypt.compare(password, user.password))) {
//         return res.status(401).send('Credenciales inválidas');
//     }

//     const isValid = await bcrypt.compare(password, user.password);
//     if (!isValid) {
//         return res.status(401).send('Contraseña incorrecta');
//     }

//     res.send('Login exitoso');
// });

// router.put('/profile', async (req, res) => {
//     try {
//       const updates = req.body;
//       const userId = req.user.id; 
//       const user = await User.findByIdAndUpdate(userId, updates, { new: true });
//       res.status(200).send(user);
//     } catch (error) {
//       res.status(500).send(error.message);
//     }
// });

module.exports = router;