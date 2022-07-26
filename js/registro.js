const urlLogin = "http://localhost:8080/auth/registro";



const formularioLogin = document.getElementById("formulario-registro");





formularioLogin.addEventListener('submit', registro);



async function registro(e){
    e.preventDefault();

    const email = e.target.email.value;
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
        let resultado = await peticionRegistro(email, password, urlLogin)
        if(resultado){
            await Swal.fire({
                position: 'top',
                icon: 'succes',
                title: 'Usuario registrado correctamente',
                showConfirmButton: true,
                timer: 3000
            })
            window.location.href = "../index.html"
        }
    }
    

    
}


async function peticionRegistro(email, password, url){
    
    let resultado = await fetch(url,{
        method: "POST",
        body:JSON.stringify({
            email: email,
            password,
            roles:["admin"]
            
        }),
        headers:{
            "Content-type": "application/json"
        }
        })
        .then(res => res.json())
        .then(res =>{
            
            return true;
        })
        .catch(err =>{
                
                Swal.fire({
                    position: 'top',
                    icon: 'error',
                    title: 'Usuario ya registrado',
                    showConfirmButton: true,
                    timer: 3000
                  })
    
        })
        return resultado;
        

}



