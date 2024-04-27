const fs = require('node:fs');
const path = require('node:path');
const arrayofproducts = require('../data/products.json');

// var arrayofproducts = [];

function getProducts() {
    return arrayofproducts;
}

function getProductById(uuid) {
    return arrayofproducts.find(p => p._uuid === uuid);
}

function createProduct(product) {
    // arrayofproducts.push(product);
    console.log("Product created");
    fs.readFile('../PRACTICA4/app/data/products.json', 'utf8', function (error, data) {
        if (error) {
            console.log(error);
        } else {
            let currentproducts = JSON.parse(data);
            currentproducts.products.push(product);
            fs.writeFile('../PRACTICA4/app/data/products.json', JSON.stringify(currentproducts), function (error) {
                if (error) {
                    console.log("error" + error);
                } else {
                    console.log("Product added");
                }
            });
        }
    });
}

function updateProduct(id, updateProduct) {
    // let index = arrayofproducts.findIndex(p => p._uuid === uuid);
    // arrayofproducts[index] = updateProduct;
    console.log("Product updated");
    fs.readFile('../PRACTICA4/app/data/products.json', 'utf8', function (error, data) {
        if (error) {
            console.log(error);
        } else {
            console.log("id: ", id);
            let currentproducts = JSON.parse(data);
            console.log("Producto anterior: ", currentproducts.products.find(p => p._uuid === id));
            console.table(currentproducts.products.find(p => p._uuid === id));
            console.table(updateProduct);
            if (updateProduct._category !== undefined) {
                currentproducts.products.find(p => p._uuid === id)._category = updateProduct._category;
            }
            if (updateProduct._pricePerUnit !== undefined) {
                currentproducts.products.find(p => p._uuid === id)._pricePerUnit = updateProduct._pricePerUnit;
            }
            if (updateProduct._stock !== undefined) {
                currentproducts.products.find(p => p._uuid === id)._stock = updateProduct._stock;
            }
            if (updateProduct._description !== undefined) {
                currentproducts.products.find(p => p._uuid === id)._description = updateProduct._description;
            }
            if (updateProduct._imageUrl !== undefined) {
                currentproducts.products.find(p => p._uuid === id)._imageUrl = updateProduct._imageUrl;
            }
            if (updateProduct._unit !== undefined) {
                currentproducts.products.find(p => p._uuid === id)._unit = updateProduct._unit;
            }
            console.log("Producto actualizado: ", currentproducts.products.find(p => p._uuid === id));

            fs.writeFile('../PRACTICA4/app/data/products.json', JSON.stringify(currentproducts), function (error) {
                if (error) {
                    console.log("error" + error);
                } else {
                    console.log("Product updated");
                }
            });
        }
    });
}

function deleteProduct(id) {
    // let index = arrayofproducts.findIndex(p => p._uuid === uuid);
    // arrayofproducts.splice(index,1);
    fs.readFile('../PRACTICA4/app/data/products.json', 'utf8', function (error, data) {
        if (error) {
            console.log(error);
        } else {
            let currentproducts = JSON.parse(data);
            let index = currentproducts.products.findIndex(element => element._uuid == id);
            currentproducts.products.splice(index, 1);
            fs.writeFile('../PRACTICA4/app/data/products.json', JSON.stringify(currentproducts), function (error) {
                if (error) {
                    console.log(error);
                } else {
                    console.log("Product deleted");
                }
            })
        }
    })
}

function findProduct(query) {
    let interpretation = query.split(':');
    let category = interpretation[0];
    let title = interpretation[1];
    console.log("Query", query);

    if (title === "") {
        console.log("Categoria", category);
        return Object.values(arrayofproducts.products).filter(p => p._category === category);
    } else if (category === "") {

        return Object.values(arrayofproducts.products).filter(p => p._title === title);
    } else {
        console.log("Producto", title, "Categoria", category);
        return Object.values(arrayofproducts.products).filter(p => p._title === title && p._category === category);
    }
}

function findProductbyid(id) {
    console.log("ID", id);
    console.log("Producto " + Object.values(arrayofproducts.products).length);
    for (let i = 0; i < Object.values(arrayofproducts.products).length; i++) {
        if (Object.values(arrayofproducts.products)[i]._uuid == id) {
            console.log("Entro");
            console.log("Producto " + i + " " + Object.values(arrayofproducts.products)[i].title);
            return Object.values(arrayofproducts.products)[i];
        }
    }
}

function productListToHtml() {
    let htmlString = '<ul>';
    arrayofproducts.forEach(product => {
        htmlString += `
            <li>
                <h3>${product._title}</h3>
                <p>Description: ${product._description}</p>
                <p>Unit: ${product._unit}</p>
                <p>Stock: ${product._stock}</p>
                <p>Price per Unit: ${product._pricePerUnit}</p>
                <p>Category: ${product._category}</p>
            </li>
        `;
    });
    htmlString += '</ul>';

    return htmlString;
}

module.exports = {
    createProduct,
    updateProduct,
    deleteProduct,
    findProduct,
    findProductbyid
};