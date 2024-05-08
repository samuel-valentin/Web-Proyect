const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

// Routers
const router = require('./app/controllers/router');
 
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static('app'));
app.use('/views',express.static('views'));
app.use('/controllers',express.static('controllers'));

// Utiliza los routers
app.use(router);

app.get('/', (req, res) => {
    console.log("e-commerce app Home Bakes");
    res.send("e-commerce app Home Bakes");
});

app.get('/new_recipe',
    (req, res) => res.sendFile(path.join(__dirname, '/app/views/new_recipe.html'))
);

app.listen(port, () => {
    console.log("Home Bakes app listening on port " + port);
});

const dir = './app/public/images';

if (!fs.existsSync(dir)){
    fs.mkdirSync(dir, { recursive: true });
}

// Crear el directorio para imágenes si no existe
const upload = multer({ dest: 'public/images' });
router.post('/upload', upload.single('filefieldname'), (req, res) => {
    res.send('Archivo cargado!');
  });