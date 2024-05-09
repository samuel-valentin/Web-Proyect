function UPDUP() {
    console.log("Entro a la funcion");
    let token = sessionStorage.getItem("user");
    token = JSON.parse(token);
    console.log(token)
    console.log(token._id)
    if (!token) {
        alert("Please log in first");
        window.location.href = "/login";
        return;
    }
    let xhr = new XMLHttpRequest();
    xhr.open('GET', '/user/info', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Authorization', `Bearer ${token._id}`);
    console.log("Enviando")
    xhr.send();
    xhr.onload = function () {
        if (xhr.status == 200) {
            const user = JSON.parse(xhr.responseText);
            console.log("Luther:", xhr.responseText);
            console.table(user);
            const profileSection = `
        <section aria-labelledby="signUp" role="region">
            <h1 class="username">YOUR PROFILE</h1>
            <h6 style="padding-left: 50px;">Manage how other users see you</h6>
            <h2 class="username">${user.name}</h2>
            <div class="profile-info">
                <div class="image-container">
                    <img src="${user.image}">
                    <br>
                    <button type="button" class="edit-button">Edit</button>
                </div>
                <div class="text-container">
                    <p>${user.description}</p>
                    <button type="button" class="edit-button" style="margin-left: -100px;">Edit</button>
                </div>
            </div>
            <h1 class="username">POSTED RECIPES</h1>
            <div class="profile-info">
            <div class="image-container">
                <img
                    src="https://images.unsplash.com/photo-1593231060852-5f040ae7df82?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Y2hvY28lMjBjaGlwJTIwY29va2llc3xlbnwwfHwwfHx8Mg%3D%3D">
            </div>
            <div class="text-container2">
                <h1>CHOCO CHIP COOKIES</h1>
                <p>Classic flavorful cookies with a small change... No sugar! Enjoy this
                    chocolate chip cookies with no guilt and share with those who might
                    prefer a healthy delicious option
                </p>
                <button type="button" id="blackbutton" style="margin-left: -100px;">Manage</button>
                <div class="button-container">
                    <button type="button" class="edit-button">Cookies</button>
                    <button type="button" class="edit-button">No sugar</button>
                    <button type="button" class="edit-button">Low skill</button>
                </div>
            </div>
        </div>
        </section>`;
            document.getElementById("fill_with_info").innerHTML = profileSection;
            loadUserRecipes(user.id);
        } else {
            console.log(xhr.status)
            console.error("Failed to fetch user profile:", xhr.statusText);
            alert("Failed to fetch profile information.");
        }
    };
}


//  function DelHouse(ID){
//    xhr = new XMLHttpRequest();
//    xhr.open('DELETE','/views/casa/delete',true);
//    xhr.setRequestHeader('Content-Type','application/json');
//    xhr.setRequestHeader('del-token',ID);
//    console.log("Enviando")
//    xhr.send();
//    document.body.style.backgroundImage = "url('https://qumin.co.uk/wp-content/uploads/2018/09/OurSevice_01_ChinaMarketing-1.gif')";
//    document.getElementById("fill_mini_houses").innerHTML = "";
//    document.getElementById("fill_with_info").innerHTML = "";
//    xhr.onload = function(){
//      setTimeout(() => {   
//        document.body.style.backgroundImage = "color:white";
//        location.reload();
//        }, 3000); 
//    }
//  };

//  function saveIDUP(ID){
//    sessionStorage.setItem("IDCasa",ID);
//    console.log("subo id");
//  }

//  function EditHouse(ID){
//    sessionStorage.setItem("IDCasa",ID);
//    sessionStorage.setItem("Editing","true");
//  };


//  function Ratingvalues(){
//    rating = document.getElementById("rating");
//    if(sessionStorage.getItem("UserValidation") != sessionStorage.getItem("IDUser")){
//      rating.innerHTML = `<button class="btn" id="green"><i class="fa fa-thumbs-up fa-lg" aria-hidden="true" onclick="rate(1)" style="color: green;"></i></button>
//      <button class="btn" id="red"><i class="fa fa-thumbs-down fa-lg" aria-hidden="true" onclick="rate(0)" style="color: red;"></i></button>
//      `;
//    ratevalue = document.getElementById("ratevalue");
//    xhr = new XMLHttpRequest();
//    xhr.open('GET','/views/user/getinfo',true);
//    xhr.setRequestHeader('Content-Type','application/json');
//    xhr.setRequestHeader('x-token',sessionStorage.getItem("IDUser"));
//    xhr.send();
//    xhr.onload = function(){
//      if(xhr.status == 200){
//        let user = JSON.parse(xhr.responseText)[0];
//        let grade = user.rating.toFixed(2);
//        ratevalue.innerHTML = `Calificación: ${grade}`;
//      }
//    }
//    
//  }
//  };

//  function rate(rate){
//    xhr = new XMLHttpRequest();
//    xhr.open('PUT','/user/rating',true);
//    xhr.setRequestHeader('Content-Type','application/json');
//    xhr.setRequestHeader('x-token',sessionStorage.getItem("IDUser"));
//    xhr.setRequestHeader('rate',rate);
//    console.log("Enviando")
//    xhr.send();
//    xhr.onload = function(){
//      if(xhr.status == 200){
//        Ratingvalues();
//      }
//    }
//  }