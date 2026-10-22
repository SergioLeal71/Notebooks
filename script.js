

let prestamos = JSON.parse(localStorage.getItem("prestamos")) || [];


const alumno = document.getElementById("alumno");
const curso = document.getElementById("curso");
const serie = document.getElementById("serie");
const mensaje = document.getElementById("mensaje");


function mostrarMensaje(texto, tipo) {
  mensaje.textContent = texto;
  mensaje.className = tipo;
}


function guardar() {
  localStorage.setItem("prestamos", JSON.stringify(prestamos));
}


function buscarPrestado(numeroSerie) {
  return prestamos.find(function (p) {
    return p.serie === numeroSerie && p.devuelto === false;
  });
}


function registrarPrestamo() {
  const nombre = alumno.value.trim();
  const cursoAlumno = curso.value.trim();
  const numeroSerie = serie.value.trim().toUpperCase();


  if (nombre === "" || cursoAlumno === "" || numeroSerie === "") {
    mostrarMensaje("Completá todos los campos.", "error");
    return;
  }


  if (buscarPrestado(numeroSerie)) {
    mostrarMensaje("Ese equipo ya está prestado.", "error");
    return;
  }


  prestamos.unshift({
    alumno: nombre,
    curso: cursoAlumno,
    serie: numeroSerie,
    salida: new Date().toLocaleString("es-AR"),
    llegada: "-",
    devuelto: false
  });

  guardar();
  alumno.value = "";
  curso.value = "";
  serie.value = "";
  mostrarMensaje("Préstamo registrado.", "ok");
  dibujar();
}


function devolverEquipo(numeroSerie) {
  const prestamo = buscarPrestado(numeroSerie);

  if (prestamo === undefined) {
    mostrarMensaje("Ese equipo no está prestado.", "error");
    return;
  }

  prestamo.devuelto = true;
  prestamo.llegada = new Date().toLocaleString("es-AR");
  guardar();
  mostrarMensaje("Equipo devuelto.", "ok");
  dibujar();
}


function devolverDesdeFormulario() {
  const numeroSerie = serie.value.trim().toUpperCase();

  if (numeroSerie === "") {
    mostrarMensaje("Escribí el N° de serie del equipo.", "error");
    return;
  }

  devolverEquipo(numeroSerie);
  serie.value = "";
}


function dibujar() {
  const listaActivos = document.getElementById("listaActivos");
  const listaHistorial = document.getElementById("listaHistorial");


  let tablaActivos = "";
  prestamos.forEach(function (p) {
    if (p.devuelto === false) {
      tablaActivos += "<tr>" +
        "<td>" + p.serie + "</td>" +
        "<td>" + p.alumno + "</td>" +
        "<td>" + p.curso + "</td>" +
        "<td><button onclick=\"devolverEquipo('" + p.serie + "')\">Devolver</button></td>" +
        "</tr>";
    }
  });

  if (tablaActivos === "") {
    listaActivos.innerHTML = "<p>No hay equipos prestados.</p>";
  } else {
    listaActivos.innerHTML = "<table>" +
      "<tr><th>Equipo</th><th>Alumno</th><th>Curso</th><th></th></tr>" +
      tablaActivos + "</table>";
  }


  let tablaHistorial = "";
  prestamos.forEach(function (p) {
    tablaHistorial += "<tr>" +
      "<td>" + p.serie + "</td>" +
      "<td>" + p.alumno + "</td>" +
      "<td>" + p.curso + "</td>" +
      "<td>" + p.salida + "</td>" +
      "<td>" + p.llegada + "</td>" +
      "</tr>";
  });

  if (tablaHistorial === "") {
    listaHistorial.innerHTML = "<p>Todavía no hay préstamos.</p>";
  } else {
    listaHistorial.innerHTML = "<table>" +
      "<tr><th>Equipo</th><th>Alumno</th><th>Curso</th><th>Salida</th><th>Devolución</th></tr>" +
      tablaHistorial + "</table>";
  }
}


function verHistorial() {
  const historial = document.getElementById("historial");
  const boton = document.getElementById("btnHistorial");

  if (historial.style.display === "none") {
    historial.style.display = "block";
    boton.textContent = "Ocultar historial";
  } else {
    historial.style.display = "none";
    boton.textContent = "Ver historial";
  }
}


function borrarHistorial() {
  if (confirm("¿Seguro que querés borrar todo el historial?")) {
    prestamos = [];
    guardar();
    mostrarMensaje("Historial borrado.", "ok");
    dibujar();
  }
}


document.getElementById("btnPrestar").onclick = registrarPrestamo;
document.getElementById("btnDevolver").onclick = devolverDesdeFormulario;
document.getElementById("btnHistorial").onclick = verHistorial;
document.getElementById("btnBorrar").onclick = borrarHistorial;


dibujar();
