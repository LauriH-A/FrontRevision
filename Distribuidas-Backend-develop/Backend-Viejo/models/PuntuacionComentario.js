const mongoose = require("mongoose");

const { Schema } = mongoose;

const puntuacionComentarioSchema = new Schema({
  imdbID: String,
  usuario: String,
  calificacion: Number,
  comentario: String
});

const PuntuacionComentarios = mongoose.model(
  "PuntuacionComentario",
  puntuacionComentarioSchema
);
console.log("se creo modelo puntuación y comentario");
module.exports = PuntuacionComentarios;
