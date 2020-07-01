const usuarios = require("../models/Usuario");

const getUsuarioByNombre = (req, res, usuarioBuscado, contraseniaIngresada) => {
  // Listar todos los usuarios
  usuarios
    .findOne({ usuario: usuarioBuscado })
    .where({ contrasenia: contraseniaIngresada })
    .then(
      respuestaQuery => {
        console.log("LOGGING RESPUESTA QUERY");
        console.log(respuestaQuery);

        if (respuestaQuery !== null) {
          res.send(respuestaQuery);
        } else {
          res.status(403).send("Usuario no encontrado");
        }
      },
      err => {
        console.log(err);
      }
    );
};

// Inserta usuario y contrasena de un usuario si el nombre de usuario no existe en mongo.usuarios.
const insertaUsuario = (req, res) => {
  const newUsuarioID = req.body.usuario;
  const newContrasenia = req.body.contrasenia;

  console.log(req.body);
  console.log(`Usuario nuevo: ${newUsuarioID}`);

  usuarios.find({ usuario: newUsuarioID }).then(usuarioEncontrado => {
    // Se ha encontrado un registro con el nombre del usuario en la base
    const tmp = usuarioEncontrado.length;

    if (tmp !== 0) {
      res.status(400).send({ Message: "El usuario ya fue registrado" });
    } else {
      // El usuario no existe y creo un objeto json que luego guardo en mongo.usuarios
      const newUsuario = usuarios({
        usuario: newUsuarioID,
        contrasenia: newContrasenia
      });

      // persiste al usuario en mongo.usuarios
      newUsuario.save().then(
        () => {
          res.status(201).send();
        },
        // si no se pudo ejecutar el save devuelve status500
        () => {
          res
            .status(500)
            .send({ Message: "La base de datos no pudo grabar al usuario" });
        }
      );
    }
  });
};

// Inserta usuario y contrasena de un usuario si el nombre de usuario no existe en mongo.usuarios.
const cambiarContrasenia = (req, res) => {
  const usuarioID = req.body.usuario;
  const { oldContrasenia } = req.body;
  const { newContrasenia } = req.body;

  console.log(`UCUsuario nuevo: ${usuarioID}`);
  console.log(`UCContrasena vieja: ${oldContrasenia}`);
  console.log(`UCContrasena nueva: ${newContrasenia}`);

  usuarios.findOne({ usuario: usuarioID }).then(usuarioEncontrado => {
    // NO se ha encontrado un registro con el nombre del usuario en la base
    if (usuarioEncontrado === null) {
      res.status(400).send({ Message: "El usuario no existe" });
    }
    // El usuario existe y contrasena anterior esta equivocada
    else if (usuarioEncontrado.contrasenia !== oldContrasenia) {
      res.status(400).send({ Message: "Contraseña anterior incorrecta" });
    }
    // El usuario existe y verifica correctamente la contrasena anterior
    else if (usuarioEncontrado.contrasenia === oldContrasenia) {
      usuarios
        .updateOne(
          { usuario: usuarioEncontrado.usuario },
          { $set: { contrasenia: newContrasenia } }
        )
        .then(
          () => {
            res
              .status(200)
              .send({ Message: "La contraseña se ha cambiado correctamente" });
          },
          () => {
            res
              .status(500)
              .send("La base de datos no pudo procesar la actualización");
          }
        );
    }
  });
};

module.exports = { getUsuarioByNombre, insertaUsuario, cambiarContrasenia };