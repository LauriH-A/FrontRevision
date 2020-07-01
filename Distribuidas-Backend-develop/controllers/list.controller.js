var ContentService = require('../services/content.service');
const { query } = require('express');
const contentService = require('../services/list.service');
const listService = require('../services/list.service');


// Saving the context of this module inside the _the variable
_this = this;


//Definiendo constantes que están en el archivo de configuración de entorno
const API_URL = process.env.API_URL;
const API_KEY = process.env.API_KEY;
const RESULTS_LANGUAGE = process.env.RESULTS_LANGUAGE;

const addList = async (req, res) => {

    console.log('Ejecutando - list.Controller.addList');

    try {

        const result = await listService.addList(req);

        console.log(result);



        if (result.status == 201)
            res.status(201).send({ status: 201, data: result.data, message: "Lista creada correctamente" });
        else {
            res.status(result.status).send({ status: result.status, message: "Ha ocurrido un error" });
        }
    }
    catch (e) {
        console.log("Ha ocurrido un error: " + e);
    }
};

//publicar las funciones seleccionadas de este módulo
module.exports = {
    addList
};

