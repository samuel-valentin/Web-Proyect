function ShowAdminProducts() {
    AdminProducts = document.getElementById("adminProducts");
    let xhr = new XMLHttpRequest();
    let item = "<br><div class=\"row\">";
    xhr.open('GET', 'http://localhost:3000/products');
    xhr.send();

    xhr.onload = function () {
        console.log("Products loaded");
        console.log(xhr.response);
        list = JSON.parse(xhr.response);
        console.table(list);
        for (let i = 0; i < list.products.length; i++) {
            item += "\
                    <div class=\"d-block col-lg-3 d-block col-md-4 d-block col-sm-6 col-8\">\
                        <img class=\"card-img-top fotos\" src=\"" + Object.values(list.products)[i]._imageUrl + "\"  alt=\"Hola insertado\">\
                        <div class=\"card-body\">\
                            <h4 class=\"card-title\">" + Object.values(list.products)[i]._title + "</h4> \
                            <label>Descripcion: <input id=\"edited_description" + Object.values(list.products)[i]._title + "\" type=\"text\" value='" + Object.values(list.products)[i]._description + "' readonly >\
                            <label>Categoria: <input id=\"edited_category" + Object.values(list.products)[i]._title + "\" type=\"text\" value='" + Object.values(list.products)[i]._category + "'readonly >\
                            <label>Unidades: <input id=\"edited_unit" + Object.values(list.products)[i]._title + "\" type=\"text\" value='" + Object.values(list.products)[i]._unit + "'readonly >\
                            <label>Precio por unidad: <input id=\"edited_price" + Object.values(list.products)[i]._title + "\" type=\"text\" value='" + Object.values(list.products)[i]._pricePerUnit + "'readonly >\
                            <label>Stock: <input id=\"edited_stock" + Object.values(list.products)[i]._title + "\" type=\"text\" value='" + Object.values(list.products)[i]._stock + "'readonly >\
                            <label>Imagen: <input id=\"edited_imageUrl" + Object.values(list.products)[i]._title + "\" type=\"text\" value='" + Object.values(list.products)[i]._imageUrl + "'readonly >\
                            <label>Titulo: <input id=\"edited_title" + Object.values(list.products)[i]._title + "\" type=\"text\" value='" + Object.values(list.products)[i]._title + "'readonly >\
                            <br>\
                            <div id='editbutton" + Object.values(list.products)[i]._title + "'>\
                                <button class=\"btn btn-danger\"  onclick=\"deleteProduct('" + list.products[i]._uuid + "')\"><i class=\"fa fa-trash icon\"></i></button>\
                                <button class=\"btn btn-primary\" onclick=\"editProduct('" + list.products[i]._title + "','" + list.products[i]._uuid + "')\"><i class=\"fa fa-edit icon\"></i></button>\
                            </div>\
                        </div>\
                    </div>\
                    <br>\
                    ";
        }
        item += "</div>";
        AdminProducts.innerHTML = item;
    }
}

function AddNewProduct() {
    let password = document.getElementById("password").value;
    let xhr = new XMLHttpRequest();
    xhr.open("POST", "http://localhost:3000/admin/products");
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('x-token', password);

    let title = document.getElementById("title").value;
    let description = document.getElementById("description").value;
    let category = document.getElementById("category").value;
    let unit = document.getElementById("unit").value;
    let pricePerUnit = document.getElementById("pricePerUnit").value;
    let stock = document.getElementById("stock").value;
    let imageUrl = document.getElementById("imageUrl").value;

    if (title == "" || description == "" || category == "" || unit == "" || pricePerUnit == "" || stock == "" || imageUrl == "") {
        alert("Faltan campos por llenar");
    } else if (isNaN(pricePerUnit) || isNaN(stock)) {
        alert("El precio y el stock deben ser numeros")
    } else {
        let product = {
            "title": title,
            "description": description,
            "imageurl": imageUrl,
            "unit": unit,
            "stock": stock,
            "price": pricePerUnit,
            "category": category,
        }
        console.log(JSON.stringify(product));
        xhr.send(JSON.stringify(product));
        xhr.onload = function () {
            if (xhr.status == 403) {
                alert("Acesso no autorizado no se cuenta con privilegios de administrador");
            } else {
                ShowAdminProducts();
                alert("Producto agregado");
            }

        }
    }
}

function deleteProduct(id) {
    let password = document.getElementById("password").value;
    xhr = new XMLHttpRequest();
    xhr.open("DELETE", "http://localhost:3000/admin/products/:" + id);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('x-token', password);
    xhr.send();
    xhr.onload = function () {
        if (xhr.status == 403) {
            alert("Acesso no autorizado no se cuenta con privilegios de administrador");
        } else {
            ShowAdminProducts();
            alert("Producto eliminado");
        }
    }
}

function editProduct(name, id) {
    console.log("Editing product " + name);
    let description = document.getElementById("edited_description" + name);
    description.removeAttribute("readonly");
    let category = document.getElementById("edited_category" + name);
    category.removeAttribute("readonly");
    let unit = document.getElementById("edited_unit" + name);
    unit.removeAttribute("readonly");
    let pricePerUnit = document.getElementById("edited_price" + name);
    pricePerUnit.removeAttribute("readonly");
    let stock = document.getElementById("edited_stock" + name);
    stock.removeAttribute("readonly");
    let imageUrl = document.getElementById("edited_imageUrl" + name);
    imageUrl.removeAttribute("readonly");

    let edit = document.getElementById("editbutton" + name);
    edit.innerHTML = "\
    <div>\
        <button class=\"btn btn-success\" type=\"button\" onclick=\"SaveEdit('" + name + "','" + id + "')\"><i class=\"fa fa-check icon\"></i></button>\
        <button class=\"btn btn-danger\" type=\"button\" onclick=\"CancelEdit('" + name + "','" + id + "')\"><i class=\"fa fa-close icon\"></i></button>\
    </div>";
    console.log("Edition available");

}

function CancelEdit(name, id) {
    console.log("Canceling edit of product " + name);
    let description = document.getElementById("edited_description" + name);
    description.setAttribute("readonly", "true");
    let category = document.getElementById("edited_category" + name);
    category.setAttribute("readonly", "true");
    let unit = document.getElementById("edited_unit" + name);
    unit.setAttribute("readonly", "true");
    let pricePerUnit = document.getElementById("edited_price" + name);
    pricePerUnit.setAttribute("readonly", "true");
    let stock = document.getElementById("edited_stock" + name);
    stock.setAttribute("readonly", "true");
    let imageUrl = document.getElementById("edited_imageUrl" + name);
    imageUrl.setAttribute("readonly", "true");

    let edit = document.getElementById("editbutton" + name);
    edit.innerHTML = "\
    <div id='editbutton" + name + "'>\
        <button class=\"btn btn-danger\"  onclick=\"deleteProduct('" + id + "')\"><i class=\"fa fa-trash icon\"></i></button>\
        <button class=\"btn btn-primary\" onclick=\"editProduct('" + name + "','" + id + "')\"><i class=\"fa fa-edit icon\"></i></button>\
    </div>";
    console.log("Edition canceled");
}

function SaveEdit(name, id) {
    let password = document.getElementById("password").value;
    let xhr = new XMLHttpRequest();
    xhr.open("PUT", "http://localhost:3000/admin/products/:" + id);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('x-token', password);
    let title = document.getElementById("edited_title" + name).value;
    let description = document.getElementById("edited_description" + name).value;
    let category = document.getElementById("edited_category" + name).value;
    let unit = document.getElementById("edited_unit" + name).value;
    let pricePerUnit = document.getElementById("edited_price" + name).value;
    let stock = document.getElementById("edited_stock" + name).value;
    let imageUrl = document.getElementById("edited_imageUrl" + name).value;
    let product = {
        "title": title,
        "description": description,
        "imageurl": imageUrl,
        "unit": unit,
        "stock": stock,
        "price": pricePerUnit,
        "category": category,
    }
    console.log(JSON.stringify(product));
    xhr.send(JSON.stringify(product));
    xhr.onload = function () {
        if (xhr.status == 403) {
            alert("Acesso no autorizado no se cuenta con privilegios de administrador");
        } else {
            ShowAdminProducts();
            alert("Producto editado");
        }

    }
}