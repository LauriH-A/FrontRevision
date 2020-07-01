// Import express
const express = require("express");
// Import Body Parser
const bodyParser = require("body-parser");
const cors = require("cors");
// Initialize the server express
const app = express();

// conectar BD
const urlBD = process.env.URLBD || "mongodb://localhost/nombreAPP";

// opciones conexion
const opts = { useNewUrlParser: true, connectTimeoutMS: 20000 };

// importo driver
const mongoose = require("mongoose");

// Pruebo conexion
mongoose.connect(urlBD, opts).then(
  () => {
    console.log("Conectado!!");
  }, // se conectó
  err => {
    console.log(`ERROR:${err}`);
  } // si no, muestro error
);

// Import router
const apiRoutes = require("./api-routes");

// Todo lo que recibe la app se tratara como json *declarando middlewares*
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
app.use(bodyParser.json());
app.use(cors());

// Setup server port
// eslint-disable-next-line no-undef
const port = process.env.PORT || 8080;

// Send message for default URL
app.get("/", (req, res) => res.send("ARRANCO EXPRESS"));

// Use Api routes in the App
app.use("/nombreAPP", apiRoutes);

// Launch app to listen to specified port
app.listen(port, function () {
  console.log(`Corriendo RestHub en puerto: ${port}`);
});
