var ContentService = require('../services/content.service');
const { query, response } = require('express');
const contentService = require('../services/content.service');

const createData = (item, idArray) => {
    //console.log("entreCreate Data",idArray)
    console.log("item", item)
    const baseURLImg = "https://image.tmdb.org/t/p/w200";
    return {  //Guarda estos datos de cada pelicula popular

        id: item.id,
        imagen: `${baseURLImg}${item.poster_path}`,
        title: item.title,
        overview: item.overview,
        votesCount: item.vote_average,
        Popularidad: item.popularity,
    };

}

// Saving the context of this module inside the _the variable
_this = this;


//Definiendo constantes que están en el archivo de configuración de entorno
const API_URL = process.env.API_URL;
const API_KEY = process.env.API_KEY;
const RESULTS_LANGUAGE = process.env.RESULTS_LANGUAGE;

//TODO agregar filtros: popularidad, exhibidas en cines, votos, tipoContenido
// Función asíncrona que devuelve los resultados que generó el ingreso de una cadena
const contentSearch = async function (req, res) {
    console.log('Ejecutando - content.Controller.contentSearch');

    if (req.body.filtrarPorPuntuacion) {
        filtroPuntuacion = "&sort_by=popularity.desc";
        console.log("Puntuaciones");

    } else {
        filtroPuntuacion = "";

    }
    if (req.body.filtrarPorVotos) {
        filtroPuntuacion = "&sort_by=vote_average.desc";

    } else {
        filtroPuntuacion = "";

    }
    if (req.body.filtrarPorCine) {
        filtroPuntuacion = "&release_date.gte=2020-02-01&release_date.lte=2020-03-20";

    } else {
        filtroPuntuacion = "";

    }



    var PAGE = req.query.page ? req.query.page : 1
    // var limit = req.query.limit ? req.query.limit : 10;

    //verifica que el parámetro de búsqueda haya llegado desde el pedido
    if (!req.body.query)
        //sino retorna error
        return res.status(400).json({ "Mensaje": "DEBE INCLUIR UN CRITERIO DE BUSQUEDA ADECUADO" });
    //guarda la cadena de busqueda tal como llegó
    let _query = req.body.query;

    //remueve espacios anteriores y posteriores de la cadena de búsqueda
    _query = _query.trim();
    //remueve los espacios interiores y los reemplaza por '+'
    _query = _query.replace(/\s+/g, "+");

    //ifs

    console.log("SE INTENTARA EJECUTAR LA SIGUIENTE QUERY: " + _query);

    //construye la uri que necesita la api según documentación https://developers.themoviedb.org/3/search/multi-search
    const uri = API_URL + "/search/multi?api_key=" + API_KEY + "&language=" + RESULTS_LANGUAGE + "&query=" + _query + "&page=" + PAGE + filtroPuntuacion;


    console.log('Se enviará el siguiente uri a API: ' + uri);

    // Check the existence of the query parameters, If doesn't exists assign a default value
    try {

        //Llama al servicio que obtiene peliculas y le envía el uri creado
        let contents = await ContentService.contentSearch(req, res, uri);


        let populares = contents.results;

        // //filtrar por los criterios seleccionados el array contents
        let obtenerPopulares = [];
        let i;
        for (i = 0; i < populares.length; i++) {
            obtenerPopulares.push(createData(populares[i], i));
        }
        return res.status(200).send(obtenerPopulares);






        //devuelve el resultado junto con el estado y un mensaje para la interfaz
        return res.status(200).json(
            {
                status: 200,
                cantResultados: contents.total_results,
                cantPaginas: contents.total_pages,
                results: contents.results,
                message: "Contenido obtenido correctamente"
            }
        );

    } catch (e) {
        //Return an Error Response Message with Code and the Error Message.
        return res.status(400).json({ status: 400, message: e.message });
    }
}


//Envía al servicio los datos para que los persista en mongo.
const saveContent = async function (req, res, next) {

    console.log("Ejecutando - Content Controller - saveContent");

    const _result = await contentService.saveContent(req, res);

    if (_result.status == 201) {
        res.status(200).send({ status: 201, result: _result.result, message: "Comentario guardado." });
    }
    else if (_result.status == 400) {
        req.status(400).send({ status: 400, result: _result.result, message: "Error al guardar comentario." });
    } else {
        res.status(500).send({ status: 500, message: "Error desconocido" });
    }
};


//Inserto comentario. Si esta en mongo actualizo el comentario, sino utilizo la función saveContent
const addComment = async (req, res) => {
    console.log('Ejecutando - content.Controller.addComment');

    //Verifico si existe en la DB
    const isOnDB = await contentService.contentExist(req);

    //Si existe agrega el comentario.
    if (isOnDB) {
        console.log("Contenido existente se agrega comentario.");

        contentService.addComment(req);
        res.status(200).send({ status: 200, message: "Comentario agregado correctamente" });
    }
    //sino existe persiste el contenido junto con el comentario
    else {
        console.log("Contenido no existente se agrega el contenido completo.");

        contentService.saveContent(req, res);
        res.status(200).send({ status: 200, message: "Contenido agregado correctamente" });
    }
};


//Obtener un array de contenido comentado por un usuario específico.
const getCommentedContentByUser = async (req, res) => {

    console.log('Ejecutando - content.Controller.getCommentedContentByUser');

    try {

        let results = await contentService.getCommentedContentByUser(req, res);

        if (results.status == 200) {
            res.status(200).send({ status: 200, result: results.data, message: "Contenido comentado por usuario." });
        }
        else {
            res.status(500).send({ status: 500, message: "Error desconocido" });
        }

    } catch (e) {
        console.log(e);

    }
};

//publicar las funciones seleccionadas de este módulo
module.exports = {
    contentSearch, saveContent, addComment, getCommentedContentByUser
};

