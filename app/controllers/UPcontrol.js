function UPDUP(){
    console.log("Entro a la funcion");
    xhr = new XMLHttpRequest();
    xhr.open('GET','/views/user/getinfo',true);
    xhr.setRequestHeader('Content-Type','application/json');
    xhr.setRequestHeader('x-token',sessionStorage.getItem("IDUser"));
    let userlogged = sessionStorage.getItem("UserValidation");
    console.log("Enviando")
    xhr.send();
    xhr.onload = function(){
        if(xhr.status == 200){       
            let user = JSON.parse(xhr.responseText)[0];
            console.table(user);
            let houseHTML = "";
            const BigInfo = `
            <br><br>
            <div class="row">
              <div class="col">
                <div class="row">
                  <div class="col">
                    <h1>${user.name}</h1>
                    <img src="${user.image}" style="width: 200px; height: 200px;" alt="Title" >
                  </div>
                  <div class="col">
                    <h2>Información</h2>
                    <p>Nombre: ${user.name}</p>
                    <p>Correo:
                      <a href="mailto:${user.email}">${user.email}</a>
                    </p>
                    <p>Teléfono: ${user.phone}</p>
                  </div>
                </div>
                <div class="row">
                  <div class="col">
                    <br><br>
                    <h2>Calificación</h2>
                    <p id="ratevalue">Calificación: ${user.rating}.toFixed(2)</p>
                    <p>Publicaciones: ${user.NoOfHomes}</p>
                  </div>
                  <div class="col">
                    <div id="rating">
                    </div>
                    </div>
                </div>
              </div>
              <div class="col" id="fill_mini_houses">
                <H1>Publicaciones</H1>
              </div>
            </div>  
          </div>`;
          let NoOfHomes = user.NoOfHomes;
          let VendeCasas = JSON.parse(xhr.responseText)[1];
          console.table(VendeCasas);
          let AllCasas = "";
          if(userlogged == user.ID){
            for(let i = 0; i < NoOfHomes; i++){
              let home = VendeCasas[i];
              houseHTML += `
                <div class="card" style="flex-direction: row;">
                  <img class="card-img-left" src="${home.image}" style="width: 200px; height: 200px;" alt="Title" >
                  <div class="card-body">
                    <h4 class="card-title">${home.type} de ${user.name}</h4>
                    <p class="card-text">${home.description}</p>
                    <a href="/../../views/casa/?id=${home.ID}" onclick="saveIDUP('${home.ID}')" class="btn btn-warning">Visitar Casa</a>  
                    <a href="/../../views/casa/?id=${home.ID}" onclick="EditHouse('${home.ID}')" class="btn btn-primary">Editar Casa</a>
                    <a onclick="DelHouse('${home.ID}')" class="btn btn-danger">Eliminar Casa</a>   
                  </div>
                </div>
                <br><br>
              `;
          }
        }
        else if(!userlogged){
          for(let i = 0; i < NoOfHomes; i++){
            console.log("User sin edicion");
            let home = VendeCasas[i];
            console.table(home);
              houseHTML += `
                <div class="card" style="flex-direction: row;">
                  <img class="card-img-left" src="${home.image}" style="width: 200px; height: 200px;" alt="Title" >
                  <div class="card-body">
                    <h4 class="card-title">${home.type} de ${user.name}</h4>
                    <p class="card-text">${home.description}</p>   
                  </div>
                </div>
                <br><br>
              `;
          }
        }
        AllCasas = AllCasas + houseHTML;
        console.log("Termine la funcion");
        document.getElementById("fill_with_info").innerHTML = BigInfo;
        document.getElementById("fill_mini_houses").innerHTML = AllCasas;
    }
    NavBar();
    Ratingvalues();
  }
  };
  
  function DelHouse(ID){
    xhr = new XMLHttpRequest();
    xhr.open('DELETE','/views/casa/delete',true);
    xhr.setRequestHeader('Content-Type','application/json');
    xhr.setRequestHeader('del-token',ID);
    console.log("Enviando")
    xhr.send();
    document.body.style.backgroundImage = "url('https://qumin.co.uk/wp-content/uploads/2018/09/OurSevice_01_ChinaMarketing-1.gif')";
    document.getElementById("fill_mini_houses").innerHTML = "";
    document.getElementById("fill_with_info").innerHTML = "";
    xhr.onload = function(){
      setTimeout(() => {   
        document.body.style.backgroundImage = "color:white";
        location.reload();
        }, 3000); 
    }
  };
  
  function saveIDUP(ID){
    sessionStorage.setItem("IDCasa",ID);
    console.log("subo id");
  }
  
  function EditHouse(ID){
    sessionStorage.setItem("IDCasa",ID);
    sessionStorage.setItem("Editing","true");
  };
  
  
  function Ratingvalues(){
    rating = document.getElementById("rating");
    if(sessionStorage.getItem("UserValidation") != sessionStorage.getItem("IDUser")){
      rating.innerHTML = `<button class="btn" id="green"><i class="fa fa-thumbs-up fa-lg" aria-hidden="true" onclick="rate(1)" style="color: green;"></i></button>
      <button class="btn" id="red"><i class="fa fa-thumbs-down fa-lg" aria-hidden="true" onclick="rate(0)" style="color: red;"></i></button>
      `;
    ratevalue = document.getElementById("ratevalue");
    xhr = new XMLHttpRequest();
    xhr.open('GET','/views/user/getinfo',true);
    xhr.setRequestHeader('Content-Type','application/json');
    xhr.setRequestHeader('x-token',sessionStorage.getItem("IDUser"));
    xhr.send();
    xhr.onload = function(){
      if(xhr.status == 200){
        let user = JSON.parse(xhr.responseText)[0];
        let grade = user.rating.toFixed(2);
        ratevalue.innerHTML = `Calificación: ${grade}`;
      }
    }
    
  }
  };
  
  function rate(rate){
    xhr = new XMLHttpRequest();
    xhr.open('PUT','/user/rating',true);
    xhr.setRequestHeader('Content-Type','application/json');
    xhr.setRequestHeader('x-token',sessionStorage.getItem("IDUser"));
    xhr.setRequestHeader('rate',rate);
    console.log("Enviando")
    xhr.send();
    xhr.onload = function(){
      if(xhr.status == 200){
        Ratingvalues();
      }
    }
  }
  