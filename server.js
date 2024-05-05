const express = require('express');
const fs = require('fs');
const router = require('./app/controllers/router');

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static('app'));
app.use('/views',express.static('views'));
app.use('/controllers',express.static('controllers'));
app.use(router);

app.get('/', (req, res) => {
    console.log("e-commerce app Home Bakes");
    res.send("e-commerce app Home Bakes");
});

app.listen(port, () => {
    console.log("Home Bakes app listening on port " + port);
});