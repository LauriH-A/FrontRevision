/**ROUTE USER APIs. */
var express = require('express')

//Rutas para la gestión de usuarios
var router = express.Router()
var users = require('./api/user.route')
router.use('/users', users);

//Rutas para la gestión de contenidos
var contents = require('./api/content.route')
router.use('/content', contents)

//Rutas para la gestión de listas
var contents = require('./api/list.route')
router.use('/list', contents)


module.exports = router;
