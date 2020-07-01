const mongoose = require("mongoose");

const { Schema } = mongoose;

const usuarioSchema = new Schema({
  usuario: String,
  contrasenia: String,
  email: String
});

const Usuarios = mongoose.model("Usuario", usuarioSchema);
console.log("Se creo modelo usuario");
module.exports = Usuarios;
