const fetch = require("node-fetch");
const peliculas = require("../models/Pelicula");
const PuntuacionComentario = require("../models/PuntuacionComentario");

const url = "http://www.omdbapi.com/";
const API_KEY = "21f9153";

/** ********************************************************************* */
/** *********FUNCIONES QUE SE COMUNICAN CON LA API********* */
const getPeliculasPorIdAPI = (req, res, id) => {
  const uri = `${url}?i=${id}&apikey=${API_KEY}`;
  console.log(uri);
  fetch(uri).then(r => r.json().then(data => res.send(data)));
};

// OBTENER COLECCION DE PELICULAS INGRESANDO UNA PARTE DEL NOMBRE
const getPeliculaPorNombreAPI = (req, res, nombre) => {
  const movies = [];
  const series = [];
  let resultado = [];

  //Busco peliculas inicialmente
  let uri = `${url}?s=${nombre}&apikey=${API_KEY}&type=movie`;
  console.log(uri);
  fetch(uri).then(r =>
    r.json().then(data => {
      if (data !== null) movies.push(data.Search);

      //si no me trae peliculas seteo en vacio
      if (movies[0] === undefined) movies[0] = [];

      //Busco series
      uri = `${url}?s=${nombre}&apikey=${API_KEY}&type=series`;
      console.log(uri);
      fetch(uri).then(r =>
        r.json().then(data => {
          if (data !== null) series.push(data.Search);

          //si no me trae series seteo en vacio
          if (series[0] === undefined) series[0] = [];

          //armo resultado con la concatenacion de peliculas y series
          resultado = movies[0].concat(series[0]);

          res.send(resultado);
        })
      );
    })
  );
};
/** ********************************************************************* */

/** *********FUNCIONES QUE SE COMUNICAN CON LA DB O CON LA API********* */
const getPeliculas = (req, res) => {
  console.log("llegue a leer");
  // Definir acá como será el buscar pelicula
  peliculas.find().then(
    listaPeliculas => {
      res.send(listaPeliculas); // devuelvo resultado query
    },
    err => {
      console.log(err);
    }
  );
};

const getPeliculasPorId = (req, res, imdbID) => {
  console.log(`llegue a leer imdbID =${imdbID}`);
  const idPeliculaABuscar = imdbID;

  // Definir acá como será el buscar pelicula
  peliculas.findOne({ imdbID: idPeliculaABuscar }).then(
    listaPeliculas => {
      console.log(
        `=========== RESPUESTA PELICULAS ENCONTRADAS: ${listaPeliculas}`
      );

      if (listaPeliculas !== null) {
        console.log("=========== LA ENCONTRE EN MONGO");
        res.send(listaPeliculas);
      } // devuelvo resultado query
      else {
        console.log("=========== LA FUI A BUSCAR A OMDB");
        getPeliculasPorIdAPI(req, res, idPeliculaABuscar);
      }
    },
    err => {
      console.log(`========= Error: ${err}`);
    }
  );
};

const getPeliculasSeriesPor = (res, ordenarPor, ascendente, limite, tipo) => {
  const asc = ascendente === "true" ? 1 : -1;
  let limit = limite !== null || limite !== undefined ? limite : 0;
  limit = Number(limit);
  console.log("Tipo: " + tipo);
  peliculas
    .find({ Type: tipo })
    .sort({ [ordenarPor]: [asc] })
    .limit(limit)
    .then(
      listaPeliculas => {
        res.send(listaPeliculas);
      },
      err => {
        console.log(err);
      }
    );
};

const getComentariosPorUsuario = (req, res) => {
  // buscar en mongo las peliculas que tengan comentarios para el usuario
  peliculas
    .find({
      PuntuacionComentario: { $elemMatch: { usuario: req.query.usuario } }
    })
    .then(
      listaPeliculas => {
        const peliculasComentadas = [];

        //recorro las peliculas
        listaPeliculas.forEach(peli => {
          const comentarios = [];

          //recorro los comentarios de la pelicula para quedarme con los del usuario
          peli.PuntuacionComentario.forEach(coment => {
            if (coment.usuario === req.query.usuario) {
              comentarios.push(coment);
            }
          });

          const pelicula = {
            imdbID: peli.imdbID,
            Title: peli.Title,
            Year: peli.Year,
            Runtime: peli.Runtime,
            Genre: peli.Genre,
            Plot: peli.Plot,
            Poster: peli.Poster,
            Actors: peli.Actors,
            imdbRating: peli.imdbRating,
            Type: peli.Type,
            PuntuacionPromedio: peli.calificacion,
            PuntuacionComentario: comentarios
          };

          peliculasComentadas.push(pelicula);
        });

        res.send(peliculasComentadas);
      },
      err => {
        console.log(err);
      }
    );
};

/** ********************************************************************* */

/** *********FUNCIONES QUE INSERTAN PELICULA O COMENTARIO********* */
// Inserta pelicula con comentario en BD
const insertPelicula = (req, res) => {
  const newPelicula = peliculas({
    imdbID: req.body.imdbID,
    Title: req.body.Title,
    Year: req.body.Year,
    Runtime: req.body.Runtime,
    Genre: req.body.Genre,
    Plot: req.body.Plot,
    Poster: req.body.Poster,
    Actors: req.body.Actors,
    imdbRating: req.body.imdbRating,
    Type: req.body.Type,
    PuntuacionPromedio: req.body.PuntuacionComentario[0].calificacion
  });

  const newPuntuacionComentario = PuntuacionComentario({
    imbdID: req.body.PuntuacionComentario[0].imdbID,
    usuario: req.body.PuntuacionComentario[0].usuario,
    calificacion: req.body.PuntuacionComentario[0].calificacion,
    comentario: req.body.PuntuacionComentario[0].comentario
  });
  newPelicula.PuntuacionComentario.push(newPuntuacionComentario);

  newPelicula.save().then(
    () => {
      res.send("OK");
    },
    () => {
      res.send("Error");
    }
  );
};

function calcularPromedio(listaPeliculas, calificacion) {
  const cant = parseFloat(listaPeliculas[0].PuntuacionComentario.length);
  const promedio = parseFloat(listaPeliculas[0].PuntuacionPromedio);
  const promedioNuevo =
    (cant * promedio + parseFloat(calificacion)) / (cant + 1);
  return Number(promedioNuevo).toFixed(1);
}

// Inserta comentario a la pelicula en BD
const insertComentario = (req, res) => {
  peliculas.find({ imdbID: req.body.imdbID }).then(
    listaPeliculas => {
      console.log(
        `=========== RESPUESTA PELICULAS ENCONTRADAS: ${listaPeliculas}`
      );

      if (listaPeliculas.length !== 0) {
        console.log("=========== LA ENCONTRE EN MONGO ");

        const promedioNuevo = calcularPromedio(
          listaPeliculas,
          req.body.PuntuacionComentario[0].calificacion
        );

        peliculas
          .updateOne(
            { imdbID: req.body.imdbID },
            { $set: { PuntuacionPromedio: promedioNuevo } }
          )
          .then(
            // eslint-disable-next-line no-empty-function
            () => { },
            err => {
              console.log(`error: ${err}`);
            }
          );

        peliculas
          .updateOne(
            { imdbID: req.body.imdbID },
            {
              $push: {
                PuntuacionComentario: {
                  imdbID: req.body.PuntuacionComentario[0].imdbID,
                  usuario: req.body.PuntuacionComentario[0].usuario,
                  calificacion: req.body.PuntuacionComentario[0].calificacion,
                  comentario: req.body.PuntuacionComentario[0].comentario
                }
              }
            }
          )
          .then(
            () => { },
            err => {
              console.log(`error: ${err}`);
            }
          );

        res.send("OK");
      } // devuelvo resultado query
      else {
        console.log("=========== INSERTO PELICULA EN MONGO");
        insertPelicula(req, res);
      }
    },
    err => {
      console.log(`========= Error: ${err}`);
    }
  );
};
/** ********************************************************************* */

module.exports = {
  getComentariosPorUsuario,
  getPeliculaPorNombreAPI,
  getPeliculas,
  getPeliculasSeriesPor,
  getPeliculasPorId,
  insertPelicula,
  insertComentario
};
