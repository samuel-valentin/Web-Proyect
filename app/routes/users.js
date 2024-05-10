const mongoose = require('mongoose');
const express = require('express');
const bcrypt = require('bcrypt');
const path = require('path');
const utils = require('../controllers/utils');
const { read } = require('fs');
const router = express.Router();
let app = express();

const keySecret = "MzVlYzY2NzU0ODQ2OTVmOTM1ZmE4NDk5MjQ1NTY3YzU="

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
router.get('/recipe',(req,res) => res.sendFile(path.resolve(__dirname + "/../views/new_recipe.html")));


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
        this.password = await bcrypt.hashSync(this.password, 10);
    }
    next();
});

var User = mongoose.model('users', userSchema);


router.get('/info',(req,res) => {
    console.log("Info working!");
    let = token = req.headers['authorization']?.split(' ')[1];
    console.log(token)
    mongoose.model('users').findOne({_id: token}).then((user) => {
        if(user == null){
            res.sendStatus(404);
        }
        else{
            res.status(200).send(user);
        }
    });
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
            description: undefined,
            image: undefined
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

        const hashedPassword = await bcrypt.hashSync(password, 10);
        
        console.log(bcrypt.compareSync(password,hashedPassword));

        const isMatch = bcrypt.compareSync(password, hashedPassword);

        console.log(user.password, isMatch);
        console.log('Password match:', isMatch);

        if (!isMatch) {
            return res.status(401).json({ message: 'Incorrect password' });
        }

        const token = jwt.sign({ id: user._id }, hashedPassword, { expiresIn: '1d' });
        console.log(token);

        res.json({ message: 'Login successful', token, user });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Error during login' });
    }
});

// router.get('/user/getinfo',(req,res) => {
//     const UserID = req.headers['x-token'];
//     console.log(UserID);
//     mongoose.model('users').findOne({ID: UserID}).then((InfoUser) => {
//         if(InfoUser == null){
//             res.sendStatus(404);
//         }
//         else{
//                 console.log("voy a mandar info de usuario");
//                 res.status(200).send(InfoUser);
//         }
//     });
// });


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

// router.post('/recipe',(req,res) => {
//     console.log("Register working!");
//     let x = req.body;
//     console.log("Body: " + x);
//     console.log("Password: " + x.password);
//     let hash = bcrypt.hashSync(x.password,10);
//     console.log("Hash: " + hash);
//     let correct_password = bcrypt.compareSync(x.password,hash);
//     console.log("Correct password: " + correct_password);
//     let y = Object.values(x);
//     console.log("Array" + y);
//     console.log("Array size: " + y.length);
//     console.log("Tipo de date" + typeof(x.date));
//     if(!y.length)
//     {
//         res.sendStatus(400);
//     }
//     else{
//         if(x.UserType == "Vendedor"){
//             mongoose.model('vendedores').findOne({email: x.email}).then((vendedor) => {
//                 if(vendedor != null){
//                     res.sendStatus(409);
//                 }
//                 else{
//                     let vendedor = new Vendedor({
//                         ID: utils.generateUUID(),
//                         name: x.name,
//                         email: x.email,
//                         password: hash,
//                         date: x.date,
//                         description: x.description,
//                         country: x.country,
//                         state: x.state,
//                         city: x.city,
//                         image: x.image,
//                         phone: x.phone,
//                         NoOfHomes: 0,
//                         homes: [],
//                         rating: 0,
//                         numberofratings: 0
//                     });
//                     console.log("Vendedor: ");
//                     console.table(vendedor);
//                     vendedor.save();
//                     res.status(200).send(vendedor.ID);
//                 }
                
//             });
                
//         }
//         else if(x.UserType == "Comprador"){
//             mongoose.model('compradores').findOne({email: x.email}).then((comprador) => {
//                 if(comprador != null){
//                     res.sendStatus(409);
//                 }
//                 else{
//                     let comprador = new Comprador({
//                         ID: utils.generateUUID(),
//                         name: x.name,
//                         email: x.email,
//                         password: hash,
//                         date: x.date,
//                         description: x.description,
//                         country: x.country,
//                         state: x.state,
//                         city: x.city,
//                         image: x.image,
//                         phone: x.phone,
//                         NoOfHomes: 0,
//                         homes: [],
//                         rating: 0,
//                         numberofratings: 0
//                     });
//                     console.log("Comprador: ");
//                     console.table(comprador);
//                     comprador.save();
//                     res.status(200).send(comprador.ID);
//                 }
//             });
//         }
//     }
// });

module.exports = router;