// Initialize express router
const router = require("express").Router();
const usuarioController = require("./controllers/UsuarioController");
const peliculaController = require("./controllers/PeliculaController");

router.get("/", function (req, res) {
  res.json({
    status: "Express iniciado Correctamente",
    message: "API NOMBREAPP OK"
  });
});

router.post("/login", function (req, res) {
  console.log(
    `Intento de inicio (login) (usuario propuesto: ${
    req.body.usuario
    })`
  );

  const { usuario } = req.body;
  const { contrasenia } = req.body;

  usuarioController.getUsuarioByNombre(req, res, usuario, contrasenia);
});


router.get("/buscar", function (req, res) {
  console.log(
    `Buscar el siguiente contenido: (${
    req.query.nombrePelicula
    })`
  );

  const { nombrePelicula } = req.query;
  peliculaController.getPeliculaPorNombreAPI(req, res, nombrePelicula);
});

// ACA HAY QUE BUSCAR PRIMERO EN MONGO, SI ESTA TRAIGO ESA, SINO BUSCO EN LA API
router.get("/getPeliculaPorId", function (req, res) {
  console.log(
    `Buscar contenido con el siguiente ID (${req.query.imdbID})`
  );

  const id = req.query.imdbID;
  peliculaController.getPeliculasPorId(req, res, id);
});

// ACA HAY QUE BUSCAR PRIMERO EN MONGO, SI ESTA TRAIGO ESA, SINO BUSCO EN LA API
router.get("/getPeliculasComentadasPorUsuario", function (req, res) {
  console.log(
    `Obtener peliculas comentadas por: (${
    req.query.usuario
    })`
  );

  const { usuario } = req.query;
  peliculaController.getComentariosPorUsuario(req, res, usuario);
});

router.get("/getPeliculasSeriesOrdenadasPor", function (req, res) {
  const ordenarPor = req.query.ordenarPor;
  const ascendente = req.query.ascendente;
  const limite = parseInt(req.query.limite);
  const tipo = req.query.tipo;

  console.log(
    "Se registra un intento de obtener peliculas ordenadas por: " +
    ordenarPor +
    " ascendente: " +
    ascendente +
    " y con limite de registros de: " +
    limite
  );
  peliculaController.getPeliculasSeriesPor(
    res,
    ordenarPor,
    ascendente,
    limite,
    tipo
  );
});

router.post("/insertarComentario", function (req, res) {
  console.log("Agregar un comentario");
  peliculaController.insertComentario(req, res);
});

router.post("/insertarUsuario", function (req, res) {
  console.log("Se registra un intento de insertar usuario nuevo");
  usuarioController.insertaUsuario(req, res);
});

router.post("/cambiarContrasenia", function (req, res) {
  console.log("Se registra un intento de cambio de contraseña.");
  usuarioController.cambiarContrasenia(req, res);
});

// Export API routes
module.exports = router;