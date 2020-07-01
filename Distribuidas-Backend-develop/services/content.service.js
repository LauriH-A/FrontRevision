// Gettign the Newly created Mongoose Model we just created 
var jwt = require('jsonwebtoken');
const fetch = require("node-fetch");

const content = require('../models/Content.model');
const scoreandcomment = require('../models/ScoreAndComment.model');

// Saving the context of this module inside the _the variable
_this = this


const contentSearch = async (req, res, uri) => {

    //en la constante contents guarda lo que recibe desde la uri ingresada.
    const contents = await fetch(uri)
        .then(function (response) {
            return response.json();
        })
        .then(function (myJson) {
            //Devuelve el resultado enviado desde la api
            return myJson;
        });

    //sale de la función devolviendo lo que fetch le envió.
    return contents;
};

//Guarda el contenido en mongo junto con el primer comentario del array de comentarios.
const saveContent = (req, res) => {

    const newContent = content({
        id: req.body.id,
        media_type: req.body.mediaType,
        title: req.body.title,
        original_title: req.body.original_title,
        release_date: req.body.release_date,
        poster_path: req.body.poster_path,
        backdrop_path: req.body.backdrop_path,
        overview: req.body.overview,
        genre_ids: req.body.genre_ids,
        original_language: req.body.original_language,
        popularity: req.body.popularity,
        vote_average: req.body.vote_average,
        origin_country: req.body.origin_country
    });

    const newScoreAndComment = new scoreandcomment({
        id: req.body.ScoreAndComment[0].id,
        user: req.body.ScoreAndComment[0].user,
        score: req.body.ScoreAndComment[0].score,
        comment: req.body.ScoreAndComment[0].comment
    });

    newContent.ScoreAndComment.push(newScoreAndComment);


    const info = newContent.save().then(
        (_result) => {
            return ({ status: 201, message: "Contenido guardado correctamente.", result: _result });
        },
        (_error) => {
            return { status: 400, message: _error };
        }
    );

    return info;
};

//Agrega comentario a un contenido existente.
const addComment = (req, res) => {

    content
        .updateOne(
            { id: req.body.id },
            {
                $push: {
                    ScoreAndComment: {
                        id: req.body.ScoreAndComment[0].id,
                        user: req.body.ScoreAndComment[0].user,
                        score: req.body.ScoreAndComment[0].score,
                        comment: req.body.ScoreAndComment[0].comment
                    }
                }
            }
        )
        .then(
            (_result) => {
                return { status: 200, result: _result }
            },
            err => {
                return { status: 400, error: err };
            }
        );
};

//Verifica que existe un contenido con la ID proporcionada a la función.
const contentExist = async (req) => {
    await content.find({ id: req.body.id }).then(
        (results) => {

            if (results.length !== 0) {
                console.log("=========== Contenido existente en MongoDB.");
                return true;
            }
            return false;
        }
    );
};

const getCommentedContentByUser = async (req, res) => {
    // buscar en mongo las peliculas que tengan comentarios para el usuario
    try {

        let resultado = await content.find({
            ScoreAndComment: { $elemMatch: { user: req.query.user } }
        })
            .then(
                _contentCommentedByUser => {
                    const commentedContent = [];

                    //recorro el array de contenidos encontrados
                    _contentCommentedByUser.forEach(_content => {
                        const comments = [];

                        //recorro los comentarios del comentario para quedarme con los del usuario especificado
                        _content.ScoreAndComment.forEach(coment => {
                            if (coment.user === req.query.user) {
                                comments.push(coment);
                            }
                        });

                        const newContent = content({
                            id: _content.id,
                            media_type: _content.mediaType,
                            title: _content.title,
                            original_title: _content.original_title,
                            release_date: _content.release_date,
                            poster_path: _content.poster_path,
                            backdrop_path: _content.backdrop_path,
                            overview: _content.overview,
                            genre_ids: _content.genre_ids,
                            original_language: _content.original_language,
                            popularity: _content.popularity,
                            vote_average: _content.vote_average,
                            origin_country: _content.origin_country,
                            ScoreAndComment: comments
                        });

                        commentedContent.push(newContent);
                    });
                    return commentedContent;
                },
                err => {
                    console.log(err);
                }
            ).catch(error => console.log(error));

        return { status: 200, data: resultado };

    } catch (error) {
        return { status: 500, errorMessage: error };
    };
};

module.exports = {
    contentSearch, saveContent, addComment, contentExist, getCommentedContentByUser
};