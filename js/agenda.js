
//Endpoints
const obtenerContactosUrl = "http://localhost:8080/contactos/listar";
const agregarContactoUrl = "http://localhost:8080/contactos/crear";
const borrarContactoUrl = "http://localhost:8080/contactos/borrar/";
const buscarContactoPorIdUrl = "http://localhost:8080/contactos/buscar/";
const actualizarContactoUrl =  "http://localhost:8080/contactos/actualizar/";

//Token
let tokenUsuario ="";
tokenUsuario = getCookie("jwToken");
comprobarToken(tokenUsuario);


//Elementos usados en los eventos
const tablaContactos = document.getElementById("bodyTabla");
const botonAgregar = document.getElementById("botonAgregar")
const formulariosBorrar = document.getElementsByClassName("borrarForm");
const botonSalir = document.getElementById("boton-salir");

//Asignacion de eventos
botonAgregar.addEventListener('click', agregarContacto);
botonSalir.addEventListener('click', salir)



obtenerContactos(tokenUsuario, obtenerContactosUrl);


function salir(e){
    Swal.fire({
      title: '¿Desea cerrar sesión?',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Salir',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        cerrarSesion();
      }
  })
}

function cerrarSesion(){
  setCookie("jwToken", "", 0);
  window.location.href = "../index.html";
}

function obtenerContactos(token,url){

  fetch(url,{
      method: "GET",
      headers:{
          "Authorization": "Bearer" + token,
          "x-token": token,
          "Content-type": "application/json"        
      }
  })
  .then(res => res.json())
  .then(res =>{
    //console.log(res)
    imprimirContactos(res, tablaContactos)
  })
  .catch(err => console.log(err));
}

function imprimirContactos(contactos, contenedor){
  contenedor.innerHTML = ``;
  contactos.map((contacto)=>{
    
    contenedor.innerHTML +=
    `
      <tr>    
        <td>${contacto.nombre}</td>
        <td>${contacto.apellido}</td>
        <td>${contacto.email}</td>
        <td>${contacto.telefono}</td>
        <td>
            <div class="container-botones-tabla">
                <form id ="actualizarForm-${contacto.id}">
                    <button type="submit" class="btn btn-warning opacidad-btn-tabla">Editar</button>
                    <input type= "hidden" value = "${contacto.id}" name="id">
                </form>
                <form id = "borrarForm-${contacto.id}">
                    <button type="submit" class="btn btn-danger opacidad-btn-tabla">Eliminar</button>
                    <input type="hidden" value = "${contacto.id}" name="id">
                </form>
            </div>
        </td>
      </tr>
     `



  })

  contactos.map((contacto)=>{
    document.getElementById(`borrarForm-${contacto.id}`).addEventListener('submit', borrarContacto);
    document.getElementById(`actualizarForm-${contacto.id}`).addEventListener('submit', actualizarContacto);
  })



}

async function agregarContacto(e){
    	
    const { value: formValues } = await Swal.fire({
      title: 'Datos del contacto',
      html:
        `
          <div class= form-contacto>
          <label for ="nombre">Nombre:</label>
          <input id="nombre" class="swal2-input">
          <label for ="Apellido">Apellido:</label>
          <input id="apellido" class="swal2-input">
          <label for ="email">Email:</label>
          <input id="email" class="swal2-input">
          <label for ="telefono">Telefono:</label>
          <input id="telefono" class="swal2-input">
          </div>
        `,
      focusConfirm: false,
      preConfirm: () => {
        return {
          nombre:document.getElementById('nombre').value,
          apellido: document.getElementById('apellido').value,
          email:document.getElementById('email').value,
          telefono: document.getElementById('telefono').value
        } 
      }
    })


    if(formValues.nombre == '' || formValues.apellido == '' || formValues.email == '' || formValues.telefono ==''){

        Swal.fire({
          position: 'top',
          icon: 'error',
          title: 'Fallo a la hora de crear el contacto',
          text: "Uno de los campos introducidos esta vacío",
          showConfirmButton: true,
          timer: 2500
        })
    }
    else{
     
      await crearContacto(agregarContactoUrl, formValues, tokenUsuario);
    }





 
}
function crearContacto(url, contacto, token){
    fetch(url,
      {
        method: "POST",
        headers:{
            "Authorization": "Bearer" + token,
            "x-token": token,
            "Content-type": "application/json"        
        },
        body:JSON.stringify({
          nombre: contacto.nombre,
          apellido: contacto.apellido,
          email: contacto.email,
          telefono: contacto.telefono
        }) 
    })
    .then(res => res.json())
    .then(res =>{
        obtenerContactos(tokenUsuario, obtenerContactosUrl);
        Swal.fire({
          position: 'top',
          icon: 'success',
          title: 'Contacto creado correctamente',
          showConfirmButton: true,
          timer: 1500
        })
    })
    .catch(err => console.log(err));
}

async function actualizarContacto (e){
  e.preventDefault();
  const idContacto = e.target.id.value;

  const contacto = await obtenerContactoPorId(buscarContactoPorIdUrl,tokenUsuario ,idContacto);

  const { value: formValues } = await Swal.fire({
    title: 'Datos del contacto',
    html:
      `
        <div class= form-contacto>
        <label for ="nombre">Nombre:</label>
        <input id="nombre" value = "${contacto.nombre}" class="swal2-input">
        <label for ="Apellido">Apellido:</label>
        <input id="apellido" value = "${contacto.apellido}" class="swal2-input">
        <label for ="email">Email:</label>
        <input id="email" value = "${contacto.email}" class="swal2-input">
        <label for ="telefono">Telefono:</label>
        <input id="telefono" value = "${contacto.telefono}"  class="swal2-input">
        </div>
      `,
    focusConfirm: false,
    preConfirm: () => {
      return {
        nombre:document.getElementById('nombre').value,
        apellido: document.getElementById('apellido').value,
        email:document.getElementById('email').value,
        telefono: document.getElementById('telefono').value
      } 
    }
  })


  if(formValues.nombre == '' || formValues.apellido == '' || formValues.email == '' || formValues.telefono ==''){
      Swal.fire({
        position: 'top',
        icon: 'error',
        title: 'Fallo a la hora de actualizar el contacto',
        text: "Uno de los campos introducidos esta vacío",
        showConfirmButton: true,
        timer: 2500
      })
  }
  else{
   
    await peticionActualizarContacto(actualizarContactoUrl, tokenUsuario, formValues, idContacto);
  }
  
  

}

function peticionActualizarContacto(url, token, contacto, id){
  fetch(url + id,
    {
      method: "PUT",
      headers:{
          "Authorization": "Bearer" + token,
          "x-token": token,
          "Content-type": "application/json"        
      },
      body:JSON.stringify({
        nombre: contacto.nombre,
        apellido: contacto.apellido,
        email: contacto.email,
        telefono: contacto.telefono
      }) 
  })
  .then(res => res.json())
  .then(res =>{
      obtenerContactos(tokenUsuario, obtenerContactosUrl);
      Swal.fire({
        position: 'top',
        icon: 'success',
        title: 'Contacto actualizado',
        showConfirmButton: true,
        timer: 1500
      })
  })
  .catch(err => console.log(err));

}

async function obtenerContactoPorId( url, token, id){
    let contacto = await
    fetch(url + id,
      {
        method: "GET",
        headers:{
            "Authorization": "Bearer" + token,
            "x-token": token,
            "Content-type": "application/json"        
        },
    })
    .then(res=> res.json())
    .then((res)=>{
      return res;
    })
    .catch(err => console.log(err))
    return contacto
}


function borrarContacto(e){
  e.preventDefault();
  const idContacto = e.target.id.value;
  
    Swal.fire({
      title: '¿Borrar este contacto?',
      text: "La acción es irreversible",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Borrar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        peticionBorrar(borrarContactoUrl, tokenUsuario, idContacto);
      }
  })

 
}

function peticionBorrar(url, token, id){
  fetch(url + id,
    {
      method: "DELETE",
      headers:{
          "Authorization": "Bearer" + token,
          "x-token": token,
          "Content-type": "application/json"        
      },
  })
  .then(res => res.json())
  .then(res =>{
    //console.log(res)
      obtenerContactos(tokenUsuario, obtenerContactosUrl);
      Swal.fire({
        position: 'top',
        icon: 'success',
        title: 'Contacto eliminado correctamente',
        showConfirmButton: true,
        timer: 1500
      })
  })
  .catch(err => console.log(err));
}

function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for(let i = 0; i <ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function setCookie(cname, cvalue, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  let expires = "expires="+ d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function comprobarToken(token){
  if(token == undefined || token == ""){
    console.log(token)
    window.location.href = "../index.html";
  }
}