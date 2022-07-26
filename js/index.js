const urlLogin = "http://localhost:8080/auth/login";
let dataUsuario  = "";


const formularioLogin = document.getElementById("formulario-login");

formularioLogin.addEventListener('submit', login);

async function login(e){
    e.preventDefault();
    const email =  e.target.email.value;
    const password = e.target.password.value;

    if(email == "" || password == ""){
        Swal.fire({
            position: 'top',
            icon: 'error',
            title: 'Los campos no pueden estar vacios',
            showConfirmButton: true,
            timer: 3000
          })
    }else{
        peticionLogin(email,password,urlLogin);
    }


    
}


function peticionLogin(email,password,url){
    
    let token = fetch(url,{
        method: "POST",
        body:JSON.stringify({
            email: email,
            password: password
        }),
        headers:{
            "Content-type": "application/json"
        }
        })
        .then(res => res.json())
        .then(res => {
            dataUsuario = res;
            return dataUsuario;   
        })
        .then(dataUsuario => comprobarDatos(dataUsuario))
        .catch(err =>{
            Swal.fire({
                position: 'top',
                icon: 'error',
                title: 'Usuario u contraseña incorrectos',
                showConfirmButton: true,
                timer: 3000
              })
        })

}

async function comprobarDatos(dataUsuario){
    if(dataUsuario != "" && dataUsuario.hasOwnProperty('token') ){

        await Swal.fire({
           position: 'top',
           icon: 'success',
           title: 'Datos correctos, bienvenido',
           showConfirmButton: true,
           timer: 3000
         })
        setCookie("jwToken", dataUsuario.token, 1);
        window.location.href = "../agenda.html";
       
    }
}

function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    let expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
    











