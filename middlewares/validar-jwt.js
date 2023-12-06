const { response, request } = require('express');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario.model');

const validarJWT = async (req = request, res = response, next) => {

    //LEO UN HEADER CON EL NOMBRE x-token
    const token = req.header('x-token');

    if (!token) {
        return res.status(401).json({
            msg: 'No hay token en la peticion'
        })
    }

    try {

        //extraigo el uid del token
        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

        
        const usuario = await Usuario.findById(uid);

        //valido que el usuario exista o no en bd
        if(!usuario){
            res.status(401).json({
                msg: 'Token no valido -- Usuario no existe en bd'
            })
        }

        //valido que el usuario no este eliminado es decir que tenga el estado false
        if(!usuario.estado){
            res.status(401).json({
                msg: 'Token no valido -- Usuario con estado false'
            })
        }

       //Agrego el objeto Usuario logeado a la request
        req.usuario = usuario;

        //agrego el uid a la request para poder usarlo en otra parte
        //req.uid = uid;

        next();
    } catch (error) {

        res.status(401).json({
            msg: 'Token no valido'
        })
    }

}

module.exports = {
    validarJWT
}
