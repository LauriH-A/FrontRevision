// Gettign the Newly created Mongoose Model we just created 
var List = require('../models/List.model');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

// Saving the context of this module inside the _the variable
_this = this

//Crear un nueva lista en la base de datos.
const addList = async (req) => {
    try {
        const newList = List({
            owner: req.body.owner,
            name: req.body.name,
            public: 0,
            contentList: []
        });

        const info = newList.save().then(
            (_result) => {
                return ({ status: 201, message: "Lista creada correctamente.", data: _result });
            },
            (_error) => {
                return { status: 400, message: _error };
            }
        );
        return info;
    }
    catch (e) {
        console.log("Error al crear la lista. " + e);
        return { status: 400, message: e };
    }
};

module.exports = { addList };