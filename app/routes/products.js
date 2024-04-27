const express = require('express');
const router = express.Router();
const fs = require('node:fs');
const products = require('../controllers/data_handler');

router.get('/', (req, res) => {
    console.log("Products working!");
    let params = req.query;
    let result;
    if (Object.keys(params).length === 0) {
        fs.readFile('./app/data/products.json', 'utf-8', (err, data) => {
            if (err) {
                console.log("err" + err);
            } else {
                console.log("Working!");
                console.table(JSON.parse(data));
                result = data;
                res.send(result);
            }
        });
    } else {
        let query;
        if (params.category === undefined)
            params.category = "";
        if (params.title === undefined)
            params.title = "";

        query = params.category;
        query += ":";
        query += params.title;
        result = products.findProduct(query);

        if (result.length === 0) {
            res.status(404);
            res.send("Product not found");
        } else {
            console.table(result);
            res.send(result);
        }
    }
});


router.post('/cart', (req, res) => {
    console.log("Cart working!");
    let x = req.body;
    let y = Object.values(x.products)
    let flag = true;
    let tmparray = [];
    console.log("Array" + y);
    console.log("Array size: " + y.length);
    if (!y.length) {
        res.sendStatus(400);
    } else {
        console.table(y);
        for (let i = 0; i < y.length; i++) {
            tmparray.push(y[i]);
        }
        console.log("Tempo array created");
        console.table(tmparray);
        for (let i = 0; i < tmparray.length; i++) {
            query = ":";
            query += tmparray[i]._title;
            console.log("Found " + products.findProduct(query).length);
            if (products.findProduct(query).length === 0 && flag) {
                console.log("Product not found");
                res.status(404);
                res.send("Product " + tmparray[i]._title + " not found");
                flag = false;
            } else if (products.findProduct(query).length > 0 && flag) {
                console.log("Product found");
                res.status(200);
                res.header("Content-Type", "application/json");
                res.json(JSON.stringify(tmparray));
                res.send();
                flag = false;
            }
        }
    }
});

router.get('/:id', (req, res) => {
    console.log("Products id working!");
    let id = req.params.id;
    let result;

    id = id.split(":").join("");
    result = products.findProductbyid(id);
    console.log("Result: " + result);
    if (typeof (result) === "object") {
        console.table(result);
        res.send(result);
    } else {
        res.status(404);
        res.send("Product not found");
    }
});

module.exports = router;