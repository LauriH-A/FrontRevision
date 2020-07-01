const mongoose = require("mongoose");
const puntuacionComentario = require("./PuntuacionComentario");

const { Schema } = mongoose;

const peliculaSchema = new Schema({
  imdbID: String,
  Title: String,
  Year: String,
  Runtime: String,
  Genre: String,
  Plot: String,
  Poster: String,
  Actors: String,
  imdbRating: String,
  Type: String,
  PuntuacionPromedio: Number,
  PuntuacionComentario: [puntuacionComentario.schema]
});

const Peliculas = mongoose.model("Pelicula", peliculaSchema);
console.log("se creo modelo de pelicula");
module.exports = Peliculas;
