const express = require('express');
const fs = require('fs');
const router = require('./app/controllers/router');

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static('app'));
app.use('/views',express.static('views'));
app.use(router);

app.get('/', (req, res) => {
    console.log("e-commerce app practica 4");
    res.send("e-commerce app practica 4");
});

app.listen(port, () => {
    console.log("Practica 3 app listening on port " + port);
});