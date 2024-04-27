const express = require('express');
const router = express.Router();
const fs = require('node:fs');
const ProductObj = require('../controllers/products');
const products = require('../controllers/data_handler');
const path = require('path');




router.post('/', (req, res) => {
    console.log("Post request received");
    let x = req.body;
    if (x.title === undefined || x.description === undefined || x.imageurl === undefined || x.unit === undefined || x.stock === undefined || x.price === undefined || x.category === undefined) {
        res.status(404);
        res.send("Error: No se han rellenado todos los campos");
    } else {
        console.log(x);
        console.log(x.title);
        let newProduct = new ProductObj.Product(x.title, x.description, x.imageurl, x.unit, x.stock, x.price, x.category);
        console.log("New product created");
        products.createProduct(newProduct);
        res.status(201);
        res.send("Producto " + newProduct._title + " creado correctamente");
    }

});

router.put('/:id', (req, res) => {
    console.log("Put request received");
    let id = req.params.id;
    id = id.split(":").join("");
    let x = req.body;
    if (x.description === undefined || x.imageurl === undefined || x.unit === undefined || x.stock === undefined || x.price === undefined || x.category === undefined) {
        res.status(404);
        res.send("Error: No se han rellenado todos los campos");
    } else {
        let UpdatedProductname = products.findProductbyid(id);
        if (UpdatedProductname === undefined) {
            res.status(404);
            res.send("Error: Producto no encontrado");
        } else {
            UpdatedProductname = UpdatedProductname._title;
            console.log("Product to update: " + UpdatedProductname);
            let newProduct = new ProductObj.Product("UpdateProduct", x.description, x.imageurl, x.unit, x.stock, x.price, x.category);
            console.log("New product created");
            products.updateProduct(id, newProduct);
            res.status(200);
            res.send("Producto " + UpdatedProductname + " actualizado correctamente");
        }
    }
});

router.delete('/:id', (req, res) => {
    console.log("Delete request received");
    let id = req.params.id;
    id = id.split(":").join("");
    let x = req.body;
    let DeletedProductname = products.findProductbyid(id);
    if (DeletedProductname === undefined) {
        res.status(404);
        res.send("Error: Producto no encontrado");
    } else {
        DeletedProductname = DeletedProductname._title;
        console.log("Product to delete: " + DeletedProductname);
        products.deleteProduct(id);
        res.status(200);
        res.send("Producto " + DeletedProductname + " eliminado correctamente");
    }
});


module.exports = router;