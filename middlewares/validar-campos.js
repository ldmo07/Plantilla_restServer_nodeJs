const { response , request } = require("express");
const { validationResult } = require('express-validator');


const validarCampos = (req = response ,res = request , next ) => {

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json(errors);
    }

    //FUNCION QUE INDICA QUE CONTINUE CON EL SGT MIDDLEWARE
    next();
}

module.exports = {
    validarCampos
}

