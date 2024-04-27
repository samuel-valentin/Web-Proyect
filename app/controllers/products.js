"use strict";
const UUID = require('./utils');

class Product {
    constructor(title, description, imageUrl, unit, stock, pricePerUnit, category) {
        this.uuid = null;
        this.title = title;
        this.description = description;
        this.imageUrl = imageUrl;
        this.unit = unit;
        this.stock = stock;
        this.pricePerUnit = pricePerUnit;
        this.category = category;
    }

    set uuid(value) {
        if (value === null) {
            // Change this to autogenerate
            // this._uuid = generateUUID();  
            this._uuid = UUID.generateUUID();
        } else {
            throw new ProductException("Product UUID are auto generated.")
        }
    }

    get uuid() {
        return this._uuid;
    }

    set stock(value) {
        if (value < 0) {
            throw new ProductException("Stock can't be negative");
        } else {
            this._stock = value;
        }

    }
    set pricePerUnit(value) {
        if (value < 0) {
            throw new ProductException("Price can't be negative");
        } else {
            this._pricePerUnit = value;
        }
    }
    set title(value) {
        if (typeof value !== 'string') {
            throw new ProductException("Title must be a string");
        } else {
            this._title = value;
        }

    }
    set description(value) {
        if (typeof value !== 'string') {
            throw new ProductException("Description must be a string");
        } else {
            this._description = value;
        }
    }
    set imageUrl(value) {
        if (typeof value !== 'string') {
            throw new ProductException("Image URL must be a string");
        } else {
            this._imageUrl = value;
        }
    }
    set unit(value) {
        if (typeof value !== 'string') {
            throw new ProductException("Unit must be a string");
        } else {
            this._unit = value;
        }
    }
    set category(value) {
        if (typeof value !== 'string') {
            throw new ProductException("Category must be a string");
        } else {
            this._category = value;
        }
    }

    static createFromJson(jsonValue) {
        let objectbyjson = JSON.parse(jsonValue);
        return new Product(objectbyjson.title, objectbyjson.description, objectbyjson.imageUrl, objectbyjson.unit, objectbyjson.stock, objectbyjson.pricePerUnit, objectbyjson.category);
    }
    static createFromObject(obj) {
        const {
            title,
            description,
            imageUrl,
            unit,
            stock,
            pricePerUnit,
            category
        } = obj;
        return new Product(title, description, imageUrl, unit, stock, pricePerUnit, category);
    }

    static cleanObject(obj) {
        return {
            _uuid: generateUUID(),
            _title: obj.title,
            _description: obj.description,
            _imageUrl: obj.imageUrl,
            _unit: obj.unit,
            _stock: obj.stock,
            _pricePerUnit: obj.pricePerUnit,
            _category: obj.category,
        }
    }
}

class ProductException {
    constructor(errorMessage) {
        this.errorMessage = errorMessage;
    }
}

class TEST {
    constructor(prueba) {
        this.test = prueba;
    }
}

module.exports = {
    Product,
    ProductException,
    TEST
};