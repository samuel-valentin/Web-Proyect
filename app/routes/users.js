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
router.get('/register',(req,res) => res.sendFile(path.resolve(__dirname + "/../views/home.html")));
router.get('/login',(req,res) => res.sendFile(path.resolve(__dirname + "/../views/home.html")));
router.get('/profile',(req,res) => res.sendFile(path.resolve(__dirname + "/../views/user_profile.html")));


// Ruta para la visualización de la página de perfil
router.get('/',(req,res) => {
    res.sendFile(path.resolve(__dirname + "/../views/user_profile.html"));
});

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    description: { type: String, default: 'Tell us about you!' },
    image: { type: String, default: 'https://images.unsplash.com/photo-1466921583968-f07aa80c526e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aW5jb2duaXRvfGVufDB8fDB8fHwy' }
});

userSchema.pre('save', async function(next) {
    if (this.isModified('password') || this.isNew) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

var User = mongoose.model('users', userSchema);

router.get('/info', (req, res) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
        return res.status(401).send('Access denied. No token provided.');
    }

    try {
        const decoded = jwt.verify(token, 'your_jwt_secret');
        User.findById(decoded.id, (err, user) => {
            if (err) {
                return res.status(500).send('Error fetching user.');
            }
            if (!user) {
                return res.status(404).send('User not found.');
            }
            res.send(user);
        });
    } catch (ex) {
        res.status(400).send('Invalid token.');
    }
});

router.post('/home', async (req, res) => {
    const { name, email, password, description, image } = req.body;
    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(409).json({ message: 'Email already exists' });
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);
        user = new User({
            name,
            email,
            password: hashedPassword,
            description: description || 'Tell us about you!',
            image: image || 'default_image_url'
        });
        
        await user.save();
        res.status(201).json({ ID: user._id, message: 'User registered successfully. Please log in.' });
    } catch (error) {
        console.error('Registration Error:', error);
        res.status(500).json({ message: 'Error registering user' });
    }
});

const jwt = require('jsonwebtoken');

// Middleware para autenticar
function authenticate(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).send('Access denied. No token provided.');
    }
    try {
        const decoded = jwt.verify(token, 'your_jwt_secret');
        req.user = decoded; // Guarda la información decodificada en req.user
        next();
    } catch (ex) {
        res.status(400).send('Invalid token.');
    }
}

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    console.log('Login attempt for email:', email);
    try {
        const user = await User.findOne({ email });
        if (!user) {
            console.log('No user found with that email');
            return res.status(401).json({ message: 'User not found' });
        }

        console.log('User found:', user);
        console.log('Submitted password:', password);
        console.log('Stored hash:', user.password);

        const isMatch = await bcrypt.compare(password, user.password);
        console.log('Password match:', isMatch);

        if (!isMatch) {
            return res.status(401).json({ message: 'Incorrect password' });
        }

        const token = jwt.sign({ id: user._id }, 'your_jwt_secret', { expiresIn: '1d' });
        res.json({ message: 'Login successful', token });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Error during login' });
    }
});

router.put('/profile', authenticate, async (req, res) => {
    try {
        const updates = req.body;
        const userId = req.user.id;
        if (!userId) {
            return res.status(400).send('User ID is required');
        }
        const user = await User.findByIdAndUpdate(userId, updates, { new: true });
        if (!user) {
            return res.status(404).send('User not found');
        }
        res.status(200).send(user);
    } catch (error) {
        console.error('Update Error:', error);
        res.status(500).send('Error updating user profile');
    }
});

module.exports = router;