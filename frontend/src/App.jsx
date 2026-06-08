import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import './css/main.css';



function App() {
  const [docentes, setDocentes] = useState([]);
  const [pagina, setPagina] = useState("inicio");
  const [nombre, setNombre] = useState("");
  const [materia, setMateria] = useState("");
  const [horario, setHorario] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [imagen, setImagen] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [docenteEditando, setDocenteEditando] = useState(null);
  const [usuarioLogin, setUsuarioLogin] = useState("");
  const [passwordLogin, setPasswordLogin] = useState("");
  const [usuarioActual, setUsuarioActual] = useState(null);
  const [numero1, setNumero1] = useState(0);
  const [numero2, setNumero2] = useState(0);
  const [respuestaCaptcha, setRespuestaCaptcha] = useState("");
  const [nuevoUsuario, setNuevoUsuario] = useState("");
  const [nuevoPassword, setNuevoPassword] = useState("");
  const [nuevoRol, setNuevoRol] = useState("docente");
  const [fuerzaPassword, setFuerzaPassword] = useState("");
  const [docenteSeleccionado, setDocenteSeleccionado] = useState(null);
  const [clasesDocente, setClasesDocente] = useState([]);
  const [claseDocenteId, setClaseDocenteId] = useState("");
  const [claseTitulo, setClaseTitulo] = useState("");
  const [claseDia, setClaseDia] = useState("");
  const [claseHora, setClaseHora] = useState("");
  const [claseModalidad, setClaseModalidad] = useState("");
  const [claseLugar, setClaseLugar] = useState("");
  const [claseObservacion, setClaseObservacion] = useState("");
  const [docenteInscripcion, setDocenteInscripcion] = useState(null);
  const [nombreEstudiante, setNombreEstudiante] = useState("");
  const [telefonoEstudiante, setTelefonoEstudiante] = useState("");
  const [comentarioInscripcion, setComentarioInscripcion] = useState("");
useEffect(() => {
  fetch("http://localhost:3001/docentes")
    .then(res => res.json())
    .then(data => setDocentes(data))
    .catch(error => console.log("Error al cargar docentes:", error));
}, []);
function iniciarSesion(e) {
  e.preventDefault();
  if (parseInt(respuestaCaptcha) !== numero1 + numero2) {
  setMensaje("CAPTCHA incorrecto");
  return;
}
  fetch("http://localhost:3001/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      usuario: usuarioLogin,
      password: passwordLogin
    })
  })
    .then(res => res.json())
    .then(data => {
      if (data.usuario) {
        setUsuarioActual(data.usuario);
        setMensaje("Bienvenido " + data.usuario.usuario);
        setUsuarioLogin("");
        setPasswordLogin("");
        setRespuestaCaptcha("");
        setPagina("inicio");
      } else {
        setMensaje(data.mensaje);
      }
    })
    .catch(error => {
      console.log(error);
      setMensaje("Error al iniciar sesión");
    });
}
function mostrarLogin() {
  return (
    <>
      <Navbar />

      <section className="py-5 bg-dark text-white" style={{ minHeight: "100vh" }}>
        <div className="container">
          <h1 className="text-center mb-4">Iniciar sesión</h1>

          <div className="row justify-content-center">
            <div className="col-12 col-md-6 col-lg-4">
              <form onSubmit={iniciarSesion} className="bg-light text-dark p-4 rounded shadow">
                
                <div className="mb-3">
                  <label className="form-label">Usuario</label>
                  <input
                    type="text"
                    className="form-control"
                    value={usuarioLogin}
                    onChange={(e) => setUsuarioLogin(e.target.value)}
                    placeholder="Ej: admin"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Contraseña</label>
                  <input
                    type="password"
                    className="form-control"
                    value={passwordLogin}
                    onChange={(e) => setPasswordLogin(e.target.value)}
                    placeholder="Ej: 12345"
                    required
                  />
                </div>
                <div className="mb-3">
                <label className="form-label">
                  CAPTCHA: ¿Cuánto es {numero1} + {numero2}?
                </label>
                <input
                  type="number"
                  className="form-control"
                  value={respuestaCaptcha}
                  onChange={(e) => setRespuestaCaptcha(e.target.value)}
                  placeholder="Respuesta"
                  required
                />
              </div>
                <button type="submit" className="btn btn-warning w-100 rounded-pill">
                  Ingresar
                </button>

                {mensaje && (
                  <div className="alert alert-info mt-3 text-center">
                    {mensaje}
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
function registrarClase(e) {
  e.preventDefault();

  if (
    claseDocenteId === "" ||
    claseTitulo.trim() === "" ||
    claseDia.trim() === "" ||
    claseHora.trim() === "" ||
    claseModalidad.trim() === "" ||
    claseLugar.trim() === ""
  ) {
    setMensaje("Debe completar todos los campos obligatorios");
    return;
  }

  const nuevaClase = {
    docente_id: claseDocenteId,
    titulo: claseTitulo,
    dia: claseDia,
    hora: claseHora,
    modalidad: claseModalidad,
    lugar: claseLugar,
    observacion: claseObservacion
  };

  fetch("http://localhost:3001/clases", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(nuevaClase)
  })
    .then(res => res.json())
    .then(data => {
      if (data.mensaje === "Clase programada correctamente") {
        setMensaje("Clase programada correctamente");

        setClaseDocenteId("");
        setClaseTitulo("");
        setClaseDia("");
        setClaseHora("");
        setClaseModalidad("");
        setClaseLugar("");
        setClaseObservacion("");
      } else {
        setMensaje(data.mensaje);
      }
    })
    .catch(error => {
      console.log(error);
      setMensaje("Error al programar clase");
    });
}
function obtenerDatosGrafico() {
  const conteo = [];

  docentes.forEach((docente) => {
    let encontrado = false;

    conteo.forEach((item) => {
      if (item.materia === docente.materia) {
        item.cantidad = item.cantidad + 1;
        encontrado = true;
      }
    });

    if (encontrado === false) {
      conteo.push({
        materia: docente.materia,
        cantidad: 1
      });
    }
  });

  return conteo;
}
function abrirInscripcion(docente) {
  setDocenteInscripcion(docente);
  setNombreEstudiante("");
  setTelefonoEstudiante("");
  setComentarioInscripcion("");
  setMensaje("");
}
function enviarInscripcion(e) {
  e.preventDefault();

  if (nombreEstudiante.trim() === "") {
    setMensaje("Debe ingresar su nombre");
    return;
  }

  if (telefonoEstudiante.trim() === "") {
    setMensaje("Debe ingresar su teléfono o WhatsApp");
    return;
  }

  const nuevaInscripcion = {
    docente_id: docenteInscripcion.id,
    nombre_estudiante: nombreEstudiante,
    telefono: telefonoEstudiante,
    comentario: comentarioInscripcion
  };

  fetch("http://localhost:3001/inscripciones", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(nuevaInscripcion)
  })
    .then(res => res.json())
    .then(data => {
      setMensaje(data.mensaje);

      setNombreEstudiante("");
      setTelefonoEstudiante("");
      setComentarioInscripcion("");

      setTimeout(() => {
        setDocenteInscripcion(null);
        setMensaje("");
      }, 1500);
    })
    .catch(error => {
      console.log(error);
      setMensaje("Error al enviar inscripción");
    });
}
function generarPDF() {
  const documento = new jsPDF();

  documento.setFontSize(18);
  documento.text("Reporte de Docentes - Smart Hunters", 14, 20);

  documento.setFontSize(11);
  documento.text("Lista de docentes registrados en el sistema.", 14, 30);

  const filas = docentes.map((docente) => [
    docente.id,
    docente.nombre,
    docente.materia,
    docente.horario,
    docente.descripcion
  ]);

  autoTable(documento, {
    head: [["ID", "Nombre", "Materia", "Horario", "Descripción"]],
    body: filas,
    startY: 40
  });

  documento.save("reporte-docentes.pdf");
}
function verInformacionClases(docente) {
  setDocenteSeleccionado(docente);

  fetch(`http://localhost:3001/docentes/${docente.id}/clases`)
    .then(res => res.json())
    .then(data => {
      setClasesDocente(data);
    })
    .catch(error => {
      console.log(error);
      setClasesDocente([]);
    });
}
function eliminarDocente(id) {
  const confirmar = window.confirm("¿Seguro que quieres eliminar este docente?");

  if (!confirmar) {
    return;
  }

  fetch(`http://localhost:3001/docentes/${id}`, {
    method: "DELETE"
  })
    .then(res => res.json())
    .then(data => {
      setMensaje(data.mensaje);

      const docentesActualizados = docentes.filter(docente => docente.id !== id);
      setDocentes(docentesActualizados);
    })
    .catch(error => {
      console.log(error);
      setMensaje("Error al eliminar docente");
    });
}
function mostrarProgramarClase() {
  return (
    <>
      <Navbar />

      <section className="py-5 bg-dark text-white" style={{ minHeight: "100vh" }}>
        <div className="container">
          <h1 className="text-center mb-4">Programar Clase</h1>

          <div className="row justify-content-center">
            <div className="col-12 col-md-8 col-lg-6">
              <form onSubmit={registrarClase} className="bg-light text-dark p-4 rounded shadow">
                
                <div className="mb-3">
                  <label className="form-label">Docente</label>
                  <select
                    className="form-control"
                    value={claseDocenteId}
                    onChange={(e) => setClaseDocenteId(e.target.value)}
                    required
                  >
                    <option value="">Seleccione un docente</option>

                    {docentes.map((docente) => (
                      <option key={docente.id} value={docente.id}>
                        {docente.nombre} - {docente.materia}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label">Título de la clase</label>
                  <input
                    type="text"
                    className="form-control"
                    value={claseTitulo}
                    onChange={(e) => setClaseTitulo(e.target.value)}
                    placeholder="Ej: Álgebra básica"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Día</label>
                  <input
                    type="text"
                    className="form-control"
                    value={claseDia}
                    onChange={(e) => setClaseDia(e.target.value)}
                    placeholder="Ej: Lunes"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Hora</label>
                  <input
                    type="time"
                    className="form-control"
                    value={claseHora}
                    onChange={(e) => setClaseHora(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Modalidad</label>
                  <select
                    className="form-control"
                    value={claseModalidad}
                    onChange={(e) => setClaseModalidad(e.target.value)}
                    required
                  >
                    <option value="">Seleccione modalidad</option>
                    <option value="Presencial">Presencial</option>
                    <option value="Virtual">Virtual</option>
                    <option value="A domicilio">A domicilio</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label">Lugar</label>
                  <input
                    type="text"
                    className="form-control"
                    value={claseLugar}
                    onChange={(e) => setClaseLugar(e.target.value)}
                    placeholder="Ej: Aula 2 o Google Meet"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Observación</label>
                  <textarea
                    className="form-control"
                    value={claseObservacion}
                    onChange={(e) => setClaseObservacion(e.target.value)}
                    placeholder="Ej: Repaso para examen prefacultativo"
                  ></textarea>
                </div>

                <button type="submit" className="btn btn-warning w-100 rounded-pill">
                  Programar clase
                </button>

                {mensaje && (
                  <div className="alert alert-info mt-3 text-center">
                    {mensaje}
                  </div>
                )}

              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
function editarDocente(docente) {
  setDocenteEditando(docente);

  setNombre(docente.nombre);
  setMateria(docente.materia);
  setHorario(docente.horario);
  setDescripcion(docente.descripcion);
  setImagen(docente.imagen);

  setMensaje("");
  setPagina("registroDocente");
}
function registrarDocente(e) {
  e.preventDefault();

  if (nombre.trim() === "") {
    setMensaje("El nombre no puede estar vacío");
    return;
  }

  if (materia.trim() === "") {
    setMensaje("La materia no puede estar vacía");
    return;
  }

  if (horario.trim() === "") {
    setMensaje("El horario no puede estar vacío");
    return;
  }

  if (descripcion.trim() === "") {
    setMensaje("La descripción no puede estar vacía");
    return;
  }

  if (descripcion.length < 10) {
    setMensaje("La descripción debe tener al menos 10 caracteres");
    return;
  }

  if (imagen.trim() === "") {
    setMensaje("La imagen no puede estar vacía");
    return;
  }

  const datosDocente = {
    nombre: nombre,
    materia: materia,
    horario: horario,
    descripcion: descripcion,
    imagen: imagen
  };

  if (docenteEditando !== null) {
    fetch(`http://localhost:3001/docentes/${docenteEditando.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(datosDocente)
    })
      .then(res => res.json())
      .then(data => {
        setMensaje("Docente actualizado correctamente");

        const docentesActualizados = docentes.map(docente => {
          if (docente.id === docenteEditando.id) {
            return data;
          } else {
            return docente;
          }
        });

        setDocentes(docentesActualizados);

        setNombre("");
        setMateria("");
        setHorario("");
        setDescripcion("");
        setImagen("");
        setDocenteEditando(null);
      })
      .catch(error => {
        console.log(error);
        setMensaje("Error al actualizar docente");
      });

    return;
  }

  fetch("http://localhost:3001/docentes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(datosDocente)
  })
    .then(res => res.json())
    .then(data => {
      setMensaje("Docente registrado correctamente");

      setDocentes([...docentes, data]);

      setNombre("");
      setMateria("");
      setHorario("");
      setDescripcion("");
      setImagen("");
    })
    .catch(error => {
      console.log(error);
      setMensaje("Error al registrar docente");
    });
}
function Navbar() {
  return (
    <nav className="navbar navbar-expand-sm navbar-dark bg-dark" id="navbar">
      <div className="container-fluid">
        <button
          className="navbar-brand btn btn-link p-0"
          onClick={() => setPagina("inicio")}
        >
          <img
            src="/img/Adobe Express - file.png"
            alt="Logo Smart Hunters"
            width="100"
          />
        </button>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav ms-auto">
                        {usuarioActual && (
              <li className="nav-item">
                <span className="nav-link text-warning">
                  {usuarioActual.usuario} ({usuarioActual.rol})
                </span>
              </li>
            )}
            {!usuarioActual && (
  <li className="nav-item">
    <button
      className="nav-link btn btn-link"
      onClick={() => {
  setNumero1(Math.floor(Math.random() * 10) + 1);
  setNumero2(Math.floor(Math.random() * 10) + 1);
  setRespuestaCaptcha("");
  setMensaje("");
  setPagina("login");
}}
    >
      Login
    </button>
  </li>
)}
{usuarioActual && usuarioActual.rol === "admin" && (
  <li className="nav-item">
    <button
      className="nav-link btn btn-link"
      onClick={() => setPagina("registroUsuario")}
    >
      Registrar usuario
    </button>
  </li>
)}
            <li className="nav-item">
              <button
                className="nav-link btn btn-link"
                onClick={() => setPagina("inicio")}
              >
                Inicio
              </button>
            </li>

            <li className="nav-item">
            <button
              className="nav-link btn btn-link"
              onClick={() => setPagina("planes")}
            >
              Planes
            </button>
          </li>

            <li className="nav-item">
              <button
              className="nav-link btn btn-link"
              onClick={() => {
                setPagina("inicio");

                setTimeout(() => {
                  const seccion = document.getElementById("sobre-nosotros");
                  if (seccion) {
                    seccion.scrollIntoView({ behavior: "smooth" });
                  }
                }, 100);
              }}
            >
              Información
            </button>
            </li>

            <li className="nav-item">
              <button
                className="nav-link btn btn-link"
                onClick={() => setPagina("catalogo")}
              >
                Catálogo
              </button>
            </li>
            {usuarioActual && usuarioActual.rol === "admin" && (
  <li className="nav-item">
    <button
      className="nav-link btn btn-link"
      onClick={() => setPagina("registroDocente")}
    >
      Registrar docente
    </button>
  </li>
)}
          <li className="nav-item">
  <button
    className="nav-link btn btn-link"
    onClick={() => setPagina("estadisticas")}
  >
    Estadísticas
  </button>
</li>
{usuarioActual && (
  <li className="nav-item">
    <button
      className="nav-link btn btn-link text-danger"
      onClick={() => {
  fetch("http://localhost:3001/logout", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      usuario: usuarioActual.usuario
    })
  })
    .then(res => res.json())
    .then(data => {
      console.log(data.mensaje);
    });

  setUsuarioActual(null);
  setPagina("inicio");
  setMensaje("Sesión cerrada");
}}
    >
      Cerrar sesión
    </button>
  </li>
)}
{usuarioActual && usuarioActual.rol === "admin" && (
  <li className="nav-item">
    <button
      className="nav-link btn btn-link"
      onClick={() => setPagina("programarClase")}
    >
      Programar clase
    </button>
  </li>
)}
          </ul>
        </div>
      </div>
    </nav>
  );
}
function mostrarCatalogo() {
  return (
    <>
      <Navbar />

      <section className="py-5 bg-dark text-white text-center">
        <div className="container">
          <h1>Catálogo completo de docentes</h1>
          <p>Elige al docente que mejor se adapte a la materia que necesitas reforzar.</p>
        </div>
      </section>

      <main className="py-5 bg-dark">
        <div className="container">
          <div className="row g-4">
            {docentes.map((docente) => (
              <div className="col-12 col-md-6 col-lg-4" key={docente.id}>
                <div className="card docente-card h-100">
                  <img
                    src={`/${docente.imagen}`}
                    className="card-img-top"
                    alt={docente.nombre}
                  />

                  <div className="card-body">
                    <h5 className="card-title">{docente.nombre}</h5>
                    <p className="card-text">
                      <strong>Materia:</strong> {docente.materia}
                    </p>
                    <p className="card-text">
                      <strong>Horario:</strong> {docente.horario}
                    </p>
                    <p className="card-text">{docente.descripcion}</p>

                    {!usuarioActual && (
                      <button
                        className="btn btn-warning rounded-pill"
                        onClick={() => abrirInscripcion(docente)}
                      >
                        Inscribirse
                      </button>
                    )}

                  {usuarioActual && usuarioActual.rol === "docente" && (
                  <button
                    className="btn btn-success rounded-pill"
                    onClick={() => verInformacionClases(docente)}
                  >
                    Ver información de clases
                  </button>
                )}

                  {usuarioActual && usuarioActual.rol === "admin" && (
                    <>
                      <button
                        className="btn btn-primary rounded-pill ms-2"
                        onClick={() => editarDocente(docente)}
                      >
                        Editar
                      </button>

                      <button
                        className="btn btn-danger rounded-pill ms-2"
                        onClick={() => eliminarDocente(docente.id)}
                      >
                        Eliminar
                      </button>
                    </>
                  )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      {docenteSeleccionado && (
  <div
    className="modal d-block"
    tabIndex="-1"
    style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
  >
    <div className="modal-dialog modal-dialog-centered">
      <div className="modal-content">
        <div className="modal-header bg-dark text-white">
          <h5 className="modal-title">
            Información de clases
          </h5>
          <button
            type="button"
            className="btn-close btn-close-white"
            onClick={() => {
              setDocenteSeleccionado(null);
              setClasesDocente([]);
            }}
          ></button>
        </div>

        <div className="modal-body text-dark">
          <h5>{docenteSeleccionado.nombre}</h5>

          <p>
            <strong>Materia:</strong> {docenteSeleccionado.materia}
          </p>

          <p>
            <strong>Horario programado:</strong> {docenteSeleccionado.horario}
          </p>

                      <hr />

            <h6>Clases programadas</h6>

            {clasesDocente.length === 0 ? (
              <p>No hay clases programadas para este docente.</p>
            ) : (
              clasesDocente.map((clase) => (
                <div key={clase.id} className="card mb-2">
                  <div className="card-body">
                    <h6 className="card-title">{clase.titulo}</h6>

                    <p className="mb-1">
                      <strong>Día:</strong> {clase.dia}
                    </p>

                    <p className="mb-1">
                      <strong>Hora:</strong> {clase.hora}
                    </p>

                    <p className="mb-1">
                      <strong>Modalidad:</strong> {clase.modalidad}
                    </p>

                    <p className="mb-1">
                      <strong>Lugar:</strong> {clase.lugar}
                    </p>

                    <p className="mb-0">
                      <strong>Observación:</strong> {clase.observacion}
                    </p>
                  </div>
                </div>
              ))
            )}
        </div>
      </div>
    </div>
  </div>
)}
{docenteInscripcion && (
  <div
    className="modal d-block"
    tabIndex="-1"
    style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
  >
    <div className="modal-dialog modal-dialog-centered">
      <div className="modal-content">
        <div className="modal-header bg-dark text-white">
          <h5 className="modal-title">
            Solicitud de inscripción
          </h5>

          <button
            type="button"
            className="btn-close btn-close-white"
            onClick={() => {
              setDocenteInscripcion(null);
              setMensaje("");
            }}
          ></button>
        </div>

        <form onSubmit={enviarInscripcion}>
          <div className="modal-body text-dark">
            <p>
              <strong>Docente:</strong> {docenteInscripcion.nombre}
            </p>

            <p>
              <strong>Materia:</strong> {docenteInscripcion.materia}
            </p>

            <div className="mb-3">
              <label className="form-label">Nombre del estudiante</label>
              <input
                type="text"
                className="form-control"
                value={nombreEstudiante}
                onChange={(e) => setNombreEstudiante(e.target.value)}
                placeholder="Ej: Juan Pérez"
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Teléfono / WhatsApp</label>
              <input
                type="text"
                className="form-control"
                value={telefonoEstudiante}
                onChange={(e) => setTelefonoEstudiante(e.target.value)}
                placeholder="Ej: 76543210"
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Comentario</label>
              <textarea
                className="form-control"
                value={comentarioInscripcion}
                onChange={(e) => setComentarioInscripcion(e.target.value)}
                placeholder="Ej: Quiero clases los sábados"
              ></textarea>
            </div>

            {mensaje && (
              <div className="alert alert-info text-center">
                {mensaje}
              </div>
            )}
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary rounded-pill"
              onClick={() => {
                setDocenteInscripcion(null);
                setMensaje("");
              }}
            >
              Cancelar
            </button>

            <button type="submit" className="btn btn-warning rounded-pill">
              Enviar solicitud
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
)}
    </>
  );
}
function mostrarPlanes() {
  return (
    <>
      <Navbar />

      <section className="py-5 text-white" style={{ backgroundColor: "#121212", minHeight: "100vh" }}>
        <div className="container py-5">
          <h1 className="text-center mb-4 titulo-naranja">
            Precios de Clases de Nivelación
          </h1>

          <h2 className="mt-5">Por Hora</h2>

          <div className="row g-4 mt-3">
            <div className="col-md-4">
              <div className="card bg-dark text-white p-3">
                <h5>1 a 5 horas</h5>
                <p className="price">35 Bs. por hora</p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card bg-dark text-white p-3">
                <h5>6 a 20 horas</h5>
                <p className="price">28 Bs. por hora</p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card bg-dark text-white p-3">
                <h5>A partir de 21 horas</h5>
                <p className="price">25 Bs. por hora</p>
              </div>
            </div>
          </div>

          <h2 className="mt-5">Planes Mensuales</h2>

          <div className="row g-4 mt-3">
            <div className="col-md-6">
              <div className="card bg-dark text-white p-3">
                <h5>Clases de 1 hora y media</h5>
                <ul>
                  <li>2 clases por semana: <span className="price">335 Bs.</span></li>
                  <li>3 clases por semana: <span className="price">500 Bs.</span></li>
                  <li>4 clases por semana: <span className="price">600 Bs.</span></li>
                  <li>5 clases por semana: <span className="price">750 Bs.</span></li>
                </ul>
              </div>
            </div>

            <div className="col-md-6">
              <div className="card bg-dark text-white p-3">
                <h5>Clases de 2 horas</h5>
                <ul>
                  <li>2 clases por semana: <span className="price">445 Bs.</span></li>
                  <li>3 clases por semana: <span className="price">600 Bs.</span></li>
                  <li>4 clases por semana: <span className="price">800 Bs.</span></li>
                  <li>5 clases por semana: <span className="price">1000 Bs.</span></li>
                </ul>
              </div>
            </div>
          </div>

          <p className="text-center mt-5">
            <em>
              Horarios bajo coordinación. Precios únicos para grupos o individuales.
              <br />
              Clases en nuestras aulas, virtuales o a domicilio.
            </em>
          </p>
        </div>

        <footer className="bg-dark text-center text-white py-3 mt-5">
          <p>© 2025 Smart Hunters | Aprende con nosotros</p>
        </footer>
      </section>
    </>
  );
}
function mostrarEstadisticas() {
  const datosGrafico = obtenerDatosGrafico();

  return (
    <>
      <Navbar />

      <section className="py-5 bg-dark text-white" style={{ minHeight: "100vh" }}>
        <div className="container">
          <h1 className="text-center mb-4">Estadísticas de docentes</h1>
          <p className="text-center">
            Cantidad de docentes registrados por materia.
          </p>
          <div className="text-center mb-4">
          <button className="btn btn-warning rounded-pill" onClick={generarPDF}>
            Generar reporte PDF
          </button>
        </div>
          <div className="bg-light p-4 rounded shadow">
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={datosGrafico}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="materia" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="cantidad" fill="#FFA500" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>
    </>
  );
}
function mostrarRegistroDocente() {
  return (
    <>
      <Navbar />

      <section className="py-5 bg-dark text-white">
        <div className="container">
          <h1 className="text-center mb-4">
          {docenteEditando ? "Editar Docente" : "Registrar Docente"}
        </h1>

          <div className="row justify-content-center">
            <div className="col-12 col-md-8 col-lg-6">
              <form onSubmit={registrarDocente} className="bg-light text-dark p-4 rounded shadow">
                
                <div className="mb-3">
                  <label className="form-label">Nombre</label>
                  <input
                    type="text"
                    className="form-control"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    placeholder="Ej: Carlos"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Materia</label>
                  <input
                    type="text"
                    className="form-control"
                    value={materia}
                    onChange={(e) => setMateria(e.target.value)}
                    placeholder="Ej: Programación"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Horario</label>
                  <input
                    type="text"
                    className="form-control"
                    value={horario}
                    onChange={(e) => setHorario(e.target.value)}
                    placeholder="Ej: Lunes y miércoles"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Descripción</label>
                  <textarea
                    className="form-control"
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                    placeholder="Describe la experiencia del docente"
                    required
                  ></textarea>
                </div>

                <div className="mb-3">
                  <label className="form-label">Imagen</label>
                  <input
                    type="text"
                    className="form-control"
                    value={imagen}
                    onChange={(e) => setImagen(e.target.value)}
                    placeholder="Ej: img/profe-carlos.png"
                    required
                  />
                  <small className="text-muted">
                    La imagen debe existir en public/img/
                  </small>
                </div>

                <button type="submit" className="btn btn-warning w-100 rounded-pill">
                  {docenteEditando ? "Guardar cambios" : "Registrar docente"}
                </button>

                {mensaje && (
                  <div className="alert alert-info mt-3 text-center">
                    {mensaje}
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
function evaluarPasswordFrontend(password) {
  let nivel = "débil";

  if (password.length >= 8) {
    nivel = "intermedia";
  }

  if (
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[0-9]/.test(password) &&
    /[^A-Za-z0-9]/.test(password)
  ) {
    nivel = "fuerte";
  }

  return nivel;
}
function registrarUsuario(e) {
  e.preventDefault();

  if (nuevoUsuario.trim() === "") {
    setMensaje("El usuario no puede estar vacío");
    return;
  }

  if (nuevoPassword.trim() === "") {
    setMensaje("La contraseña no puede estar vacía");
    return;
  }

  const fuerza = evaluarPasswordFrontend(nuevoPassword);

  if (fuerza === "débil") {
    setMensaje("La contraseña es débil. Usa mínimo 8 caracteres.");
    return;
  }

  fetch("http://localhost:3001/usuarios", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      usuario: nuevoUsuario,
      password: nuevoPassword,
      rol: nuevoRol
    })
  })
    .then(res => res.json())
    .then(data => {
      if (data.mensaje === "Usuario registrado correctamente") {
        setMensaje("Usuario registrado correctamente. Fuerza: " + data.fuerza);

        setNuevoUsuario("");
        setNuevoPassword("");
        setNuevoRol("docente");
        setFuerzaPassword("");
      } else {
        setMensaje(data.mensaje);
      }
    })
    .catch(error => {
      console.log(error);
      setMensaje("Error al registrar usuario");
    });
}
function mostrarRegistroUsuario() {
  return (
    <>
      <Navbar />

      <section className="py-5 bg-dark text-white" style={{ minHeight: "100vh" }}>
        <div className="container">
          <h1 className="text-center mb-4">Registrar Usuario</h1>

          <div className="row justify-content-center">
            <div className="col-12 col-md-6 col-lg-4">
              <form onSubmit={registrarUsuario} className="bg-light text-dark p-4 rounded shadow">

                <div className="mb-3">
                  <label className="form-label">Usuario</label>
                  <input
                    type="text"
                    className="form-control"
                    value={nuevoUsuario}
                    onChange={(e) => setNuevoUsuario(e.target.value)}
                    placeholder="Ej: juan"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Contraseña</label>
                  <input
                    type="password"
                    className="form-control"
                    value={nuevoPassword}
                    onChange={(e) => {
                      setNuevoPassword(e.target.value);
                      setFuerzaPassword(evaluarPasswordFrontend(e.target.value));
                    }}
                    placeholder="Ej: Usuario123*"
                    required
                  />

                  {fuerzaPassword && (
                    <small>
                      Fuerza de contraseña: <strong>{fuerzaPassword}</strong>
                    </small>
                  )}
                </div>

                <div className="mb-3">
                  <label className="form-label">Rol</label>
                  <select
                    className="form-control"
                    value={nuevoRol}
                    onChange={(e) => setNuevoRol(e.target.value)}
                  >
                    <option value="docente">Docente</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <button type="submit" className="btn btn-warning w-100 rounded-pill">
                  Registrar usuario
                </button>

                {mensaje && (
                  <div className="alert alert-info mt-3 text-center">
                    {mensaje}
                  </div>
                )}

              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
if (pagina === "catalogo") {
  return mostrarCatalogo();
}
if (pagina === "planes") {
  return mostrarPlanes();
}
if (pagina === "registroDocente") {
  return mostrarRegistroDocente();
}
if (pagina === "estadisticas") {
  return mostrarEstadisticas();
}
if (pagina === "login") {
  return mostrarLogin();
}
if (pagina === "registroUsuario") {
  return mostrarRegistroUsuario();
}
if (pagina === "programarClase") {
  return mostrarProgramarClase();
}
  return (
    <>
      <Navbar />
      <div id="mainSlider" className="carousel slide" data-bs-ride="carousel">
  <div className="carousel-inner">
    <div className="carousel-item active">
      <img
        src="/img/518318327_1057663883138652_6706159477875280992_n.jpg"
        className="d-block w-100"
        alt="Smart Hunters 1"
      />
    </div>

    <div className="carousel-item">
      <img
        src="/img/496007364_1016712757233765_7867448925951599612_n.jpg"
        className="d-block w-100"
        alt="Smart Hunters 2"
      />
    </div>

    <div className="carousel-item">
      <img
        src="/img/smarthunters2imagen.jpg"
        className="d-block w-100"
        alt="Smart Hunters 3"
      />
    </div>
  </div>

  <button
    className="carousel-control-prev"
    type="button"
    data-bs-target="#mainSlider"
    data-bs-slide="prev"
  >
    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
    <span className="visually-hidden">Anterior</span>
  </button>

  <button
    className="carousel-control-next"
    type="button"
    data-bs-target="#mainSlider"
    data-bs-slide="next"
  >
    <span className="carousel-control-next-icon" aria-hidden="true"></span>
    <span className="visually-hidden">Siguiente</span>
  </button>
</div>
<section id="sobre-nosotros" className="py-5 bg-dark">
  <div className="container">
    <h2 className="text-center display-5 fw-bold mb-4">
      SOBRE<br />NOSOTROS
    </h2>

    <div
      className="row align-items-center border rounded p-3"
      style={{ boxShadow: "0 6px 18px rgba(0,0,0,0.06)" }}
    >
      <div className="col-md-7">
        <p className="fs-5 text-justify" style={{ fontFamily: "'Bitter', serif" }}>
          <strong>Smart Hunters</strong> es una academia especializada en enseñar
          a sus estudiantes sobre los temas que el mismo elija. Escogemos el
          docente más adecuado para que usted pueda aprender de una forma rápida
          y sencilla. Resolvemos todas sus dudas y atendemos sus prioridades.
        </p>
      </div>

      <div className="col-md-5 text-center">
        <img
          src="/img/imagen gente estudiando.jpeg"
          alt="estudiantes"
          className="img-fluid rounded sobre-img"
        />
      </div>
    </div>
  </div>
</section>
<div id="games">
  <div className="container-md p-5">
    <div className="row pt-5">
      <h3 className="text-center pb-5 pt-5 h1 text-light">
        MATERIAS MAS COTIZADAS
      </h3>
    </div>

    <div className="row">
      <div className="col-sm">
        <div className="card w-100 card-border mb-5">
          <img src="/img/matematicas.png" className="card-img-top" alt="Matemáticas" />
          <div className="card-body">
            <p className="card-text">
              MATEMATICAS: Siempre una materia bastante importante y requerida en
              casi toda carrera universitaria como informática, medicina,
              arquitectura, contabilidad, etc. Se cuenta con docentes con
              experiencia universitaria para el aprendizaje del tema matemático a elegir.
            </p>
          </div>
        </div>
      </div>

      <div className="col-sm">
        <div className="card w-100 card-border mb-5">
          <img src="/img/imagen gente exitosa.jpeg" className="card-img-top" alt="Física" />
          <div className="card-body">
            <p className="card-text">
              FISICA: Materia de bastante importancia, especialmente en carreras
              como ingeniería, desarrollo de tecnología, mecatrónica y física.
              Contamos con docentes con experiencia en instituciones dedicadas a la física.
            </p>
          </div>
        </div>
      </div>

      <div className="col-sm">
        <div className="card w-100 card-border mb-5">
          <img src="/img/quimicaimagen.jpeg" className="card-img-top" alt="Química" />
          <div className="card-body">
            <p className="card-text">
              QUIMICA: Esta materia es de mucha importancia en carreras como
              ciencias naturales, química, bioquímica y química ambiental.
              Nuestros docentes cuentan con preparación para exámenes y asignaturas.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
<div id="amiibos" className="px-5 pb-5 bg-success">
  <div className="container">
    <div className="row">
      <h2 className="text-center text-white text-shadow h1">
        Docentes destacados
      </h2>
    </div>

    <div id="contenedor-docentes" className="row row-cols-1 row-cols-sm-2 row-cols-md-4">
      {docentes.slice(0, 4).map((docente) => (
        <div className="col text-center" key={docente.id}>
          <div className="imagen-docente">
  <img src={`/${docente.imagen}`} alt={docente.nombre} className="amiibo" />
</div>
          <span className="amiibo-name h5 p-2 d-inline-block mt-2">
            {docente.nombre}
          </span>
          <p>{docente.materia}</p>
        </div>
      ))}
    </div>

    <div className="row py-5">
      <div className="col text-center">
        <button
  className="btn btn-warning btn-lg rounded-pill p-3 font-weight-bold"
  onClick={() => setPagina("catalogo")}
>
  Ver catálogo de docentes
</button>
      </div>
    </div>
  </div>
</div>
    </>
  );
}

export default App;