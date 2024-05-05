const mongoose = require('mongoose');
const express = require('express');
const bcrypt = require('bcrypt');
const path = require('path');
const utils = require('../controllers/utils');
const { read } = require('fs');
const router = express.Router();
let app = express();

const mongoURI = 'mongodb+srv://oscarchiw:HomeBakesDASW@daswproject.ur4wdy7.mongodb.net/HomeBakes';
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("Connected successfully to MongoDB");
});

router.get('/register',(req,res) => res.sendFile(path.resolve(__dirname + "/../views/registro.html")));
router.get('/login',(req,res) => res.sendFile(path.resolve(__dirname + "/../views/login.html")));
router.get('/profile',(req,res) => res.sendFile(path.resolve(__dirname + "/../views/user_profile.html")));


// Ruta para la visualización de la página de perfil
router.get('/',(req,res) => {
    res.sendFile(path.resolve(__dirname + "/../views/user_profile.html"));
});

const userSchema = new mongoose.Schema({
    name: { type: String, unique: true, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    description: { type: String, default: '' },
    image: { type: String, default: '' }
});

userSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
      this.password = await bcrypt.hash(this.password, 12);
    }
    next();
  });

const User = mongoose.model('User', userSchema);

router.post('/register', async (req, res) => {
    console.log(req.body); // Verifica que los datos recibidos son correctos.
    try {
        const { name, email, password } = req.body;
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).send('El usuario ya existe.');
        }

        user = new User({ name, email, password });
        await user.save();
        res.status(201).send('Usuario creado exitosamente');
    } catch (error) {
        console.error('Error en el registro:', error);
        res.status(500).send(error.message);
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).send('Credenciales inválidas');
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
        return res.status(401).send('Contraseña incorrecta');
    }

    res.send('Login exitoso');
});

router.put('/profile', async (req, res) => {
    try {
      const updates = req.body;
      const userId = req.user.id; 
      const user = await User.findByIdAndUpdate(userId, updates, { new: true });
      res.status(200).send(user);
    } catch (error) {
      res.status(500).send(error.message);
    }
});

module.exports = router;