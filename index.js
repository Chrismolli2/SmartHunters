import cors from "cors";
import express from "express";
import { check, validationResult } from "express-validator";
import conexion from "./db.js";
import bcrypt from "bcryptjs";

let docentes = [
  {
    id: 1,
    nombre: "Sergio",
    materia: "Matemáticas",
    horario: "Lunes, miércoles y viernes",
    descripcion: "Docente especializado en álgebra, cálculo y preparación universitaria.",
    imagen: "img/profe-sergio.png",
    estado: "activo"
  },
  {
    id: 2,
    nombre: "Fred",
    materia: "Física",
    horario: "Lunes a viernes",
    descripcion: "Docente enfocado en física básica, mecánica y resolución de ejercicios.",
    imagen: "img/profe-fred.png",
    estado: "activo"
  },
  {
    id: 3,
    nombre: "Andrea",
    materia: "Química",
    horario: "Lunes a viernes",
    descripcion: "Docente preparado para química general y ejercicios prácticos.",
    imagen: "img/profe-andrea.png",
    estado: "activo"
  },
  {
    id: 4,
    nombre: "Mariana",
    materia: "Lenguaje",
    horario: "Martes y jueves",
    descripcion: "Apoyo en redacción y comprensión lectora.",
    imagen: "img/profe-mariano.png",
    estado: "activo"
  }
];
let usuarios = [
  {
    id: 1,
    usuario: "admin",
    password: "12345",
    rol: "admin"
  },
  {
    id: 2,
    usuario: "docente",
    password: "12345",
    rol: "docente"
  }
];
const app = express();

app.use(cors());
app.use(express.json());
function evaluarPassword(password) {
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

app.get("/probar-db", async (req, res) => {
  try {
    const [resultado] = await conexion.query("SELECT * FROM docentes");
    res.json(resultado);
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al conectar con la base de datos",
      error: error.message
    });
  }
});
// MOSTRAR SOLO DOCENTES ACTIVOS
app.get("/docentes", async (req, res) => {
  try {
    const [docentes] = await conexion.query(
      "SELECT * FROM docentes WHERE estado = 'activo'"
    );

    res.json(docentes);
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al obtener docentes",
      error: error.message
    });
  }
});

app.post(
  "/docentes",
  [
    check("nombre")
      .notEmpty()
      .withMessage("El nombre no puede estar vacío"),

    check("materia")
      .notEmpty()
      .withMessage("La materia no puede estar vacía"),

    check("horario")
      .notEmpty()
      .withMessage("El horario no puede estar vacío"),

    check("descripcion")
      .notEmpty()
      .withMessage("La descripción no puede estar vacía")
      .isLength({ min: 10 })
      .withMessage("La descripción debe tener al menos 10 caracteres"),

    check("imagen")
      .notEmpty()
      .withMessage("La imagen no puede estar vacía")
  ],
  async (req, res) => {
    try {
      const errores = validationResult(req);

      if (!errores.isEmpty()) {
        return res.status(400).json({
          mensaje: errores.array()
        });
      }

      const { nombre, materia, horario, descripcion, imagen } = req.body;

      const [resultado] = await conexion.query(
        "INSERT INTO docentes (nombre, materia, horario, descripcion, imagen, estado) VALUES (?, ?, ?, ?, ?, ?)",
        [nombre, materia, horario, descripcion, imagen, "activo"]
      );

      res.status(201).json({
        id: resultado.insertId,
        nombre,
        materia,
        horario,
        descripcion,
        imagen,
        estado: "activo"
      });

    } catch (error) {
      res.status(500).json({
        mensaje: "Error al registrar docente",
        error: error.message
      });
    }
  }
);

app.patch("/docentes/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const { nombre, materia, horario, descripcion, imagen } = req.body;

    const [resultado] = await conexion.query(
      "UPDATE docentes SET nombre = ?, materia = ?, horario = ?, descripcion = ?, imagen = ? WHERE id = ?",
      [nombre, materia, horario, descripcion, imagen, id]
    );

    if (resultado.affectedRows === 0) {
      return res.status(404).json({
        mensaje: "Docente no encontrado"
      });
    }

    res.json({
      id: parseInt(id),
      nombre,
      materia,
      horario,
      descripcion,
      imagen,
      estado: "activo"
    });

  } catch (error) {
    res.status(500).json({
      mensaje: "Error al actualizar docente",
      error: error.message
    });
  }
});

app.delete("/docentes/:id", async (req, res) => {
  try {
    const id = req.params.id;

    const [resultado] = await conexion.query(
      "UPDATE docentes SET estado = 'inactivo' WHERE id = ?",
      [id]
    );

    if (resultado.affectedRows === 0) {
      return res.status(404).json({
        mensaje: "Docente no encontrado"
      });
    }

    res.json({
      mensaje: "Docente eliminado lógicamente"
    });

  } catch (error) {
    res.status(500).json({
      mensaje: "Error al eliminar docente",
      error: error.message
    });
  }
});
app.post("/login", async (req, res) => {
  try {
    const { usuario, password } = req.body;

    const [usuarios] = await conexion.query(
      "SELECT * FROM usuarios WHERE usuario = ?",
      [usuario]
    );

    if (usuarios.length === 0) {
      return res.status(401).json({
        mensaje: "Usuario o contraseña incorrectos"
      });
    }

    const usuarioEncontrado = usuarios[0];

    const passwordCorrecto = await bcrypt.compare(
      password,
      usuarioEncontrado.password
    );

    if (!passwordCorrecto) {
      return res.status(401).json({
        mensaje: "Usuario o contraseña incorrectos"
      });
    }
    const ip = req.ip;
    const browser = req.headers["user-agent"];

    await conexion.query(
      "INSERT INTO logs_acceso (usuario, ip, evento, browser) VALUES (?, ?, ?, ?)",
      [usuarioEncontrado.usuario, ip, "ingreso", browser]
    );
    res.json({
      mensaje: "Login correcto",
      usuario: {
        id: usuarioEncontrado.id,
        usuario: usuarioEncontrado.usuario,
        rol: usuarioEncontrado.rol
      }
    });

  } catch (error) {
    res.status(500).json({
      mensaje: "Error al iniciar sesión",
      error: error.message
    });
  }
});
app.post("/usuarios", async (req, res) => {
  try {
    const { usuario, password, rol } = req.body;

    if (!usuario || !password || !rol) {
      return res.status(400).json({
        mensaje: "Debe enviar usuario, contraseña y rol"
      });
    }

    const fuerza = evaluarPassword(password);

    if (fuerza === "débil") {
      return res.status(400).json({
        mensaje: "La contraseña es débil",
        fuerza: fuerza
      });
    }

    const [existeUsuario] = await conexion.query(
      "SELECT * FROM usuarios WHERE usuario = ?",
      [usuario]
    );

    if (existeUsuario.length > 0) {
      return res.status(400).json({
        mensaje: "El usuario ya existe"
      });
    }

    const passwordEncriptada = await bcrypt.hash(password, 10);

    const [resultado] = await conexion.query(
      "INSERT INTO usuarios (usuario, password, rol) VALUES (?, ?, ?)",
      [usuario, passwordEncriptada, rol]
    );

    res.status(201).json({
      mensaje: "Usuario registrado correctamente",
      id: resultado.insertId,
      usuario,
      rol,
      fuerza
    });

  } catch (error) {
    res.status(500).json({
      mensaje: "Error al registrar usuario",
      error: error.message
    });
  }
});
app.post("/usuarios", async (req, res) => {
  try {
    const { usuario, password, rol } = req.body;

    if (!usuario || !password || !rol) {
      return res.status(400).json({
        mensaje: "Debe enviar usuario, contraseña y rol"
      });
    }

    const fuerza = evaluarPassword(password);

    if (fuerza === "débil") {
      return res.status(400).json({
        mensaje: "La contraseña es débil",
        fuerza: fuerza
      });
    }

    const [existeUsuario] = await conexion.query(
      "SELECT * FROM usuarios WHERE usuario = ?",
      [usuario]
    );

    if (existeUsuario.length > 0) {
      return res.status(400).json({
        mensaje: "El usuario ya existe"
      });
    }

    const passwordEncriptada = await bcrypt.hash(password, 10);

    const [resultado] = await conexion.query(
      "INSERT INTO usuarios (usuario, password, rol) VALUES (?, ?, ?)",
      [usuario, passwordEncriptada, rol]
    );

    res.status(201).json({
      mensaje: "Usuario registrado correctamente",
      id: resultado.insertId,
      usuario,
      rol,
      fuerza
    });

  } catch (error) {
    res.status(500).json({
      mensaje: "Error al registrar usuario",
      error: error.message
    });
  }
});
app.post("/logout", async (req, res) => {
  try {
    const { usuario } = req.body;

    const ip = req.ip;
    const browser = req.headers["user-agent"];

    await conexion.query(
      "INSERT INTO logs_acceso (usuario, ip, evento, browser) VALUES (?, ?, ?, ?)",
      [usuario, ip, "salida", browser]
    );

    res.json({
      mensaje: "Salida registrada correctamente"
    });

  } catch (error) {
    res.status(500).json({
      mensaje: "Error al registrar salida",
      error: error.message
    });
  }
});
app.get("/docentes/:id/clases", async (req, res) => {
  try {
    const { id } = req.params;

    const [clases] = await conexion.query(
      "SELECT * FROM clases_programadas WHERE docente_id = ?",
      [id]
    );

    res.json(clases);

  } catch (error) {
    res.status(500).json({
      mensaje: "Error al obtener clases programadas",
      error: error.message
    });
  }
});
app.post("/clases", async (req, res) => {
  try {
    const { docente_id, titulo, dia, hora, modalidad, lugar, observacion } = req.body;

    if (!docente_id || !titulo || !dia || !hora || !modalidad || !lugar) {
      return res.status(400).json({
        mensaje: "Debe completar todos los campos obligatorios"
      });
    }

    const [resultado] = await conexion.query(
      "INSERT INTO clases_programadas (docente_id, titulo, dia, hora, modalidad, lugar, observacion) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [docente_id, titulo, dia, hora, modalidad, lugar, observacion]
    );

    res.status(201).json({
      mensaje: "Clase programada correctamente",
      clase: {
        id: resultado.insertId,
        docente_id,
        titulo,
        dia,
        hora,
        modalidad,
        lugar,
        observacion
      }
    });

  } catch (error) {
    res.status(500).json({
      mensaje: "Error al registrar clase programada",
      error: error.message
    });
  }
});
app.post("/inscripciones", async (req, res) => {
  try {
    const { docente_id, nombre_estudiante, telefono, comentario } = req.body;

    if (!docente_id || !nombre_estudiante || !telefono) {
      return res.status(400).json({
        mensaje: "Debe completar docente, nombre del estudiante y teléfono"
      });
    }

    const [resultado] = await conexion.query(
      "INSERT INTO inscripciones (docente_id, nombre_estudiante, telefono, comentario, estado) VALUES (?, ?, ?, ?, ?)",
      [docente_id, nombre_estudiante, telefono, comentario, "pendiente"]
    );

    res.status(201).json({
      mensaje: "Solicitud de inscripción enviada correctamente",
      inscripcion: {
        id: resultado.insertId,
        docente_id,
        nombre_estudiante,
        telefono,
        comentario,
        estado: "pendiente"
      }
    });

  } catch (error) {
    res.status(500).json({
      mensaje: "Error al registrar inscripción",
      error: error.message
    });
  }
});
app.listen(3001, () => {
  console.log("Servidor en puerto 3001");
});
app.patch("/docentes/:id/activar", (req, res) => {
  const id = parseInt(req.params.id);

  const docente = docentes.find(docente => docente.id === id);

  if (!docente) {
    return res.status(404).json({
      mensaje: "Docente no encontrado"
    });
  }

  docente.estado = "activo";

  res.json({
    mensaje: "Docente activado nuevamente",
    docente: docente
  });
});