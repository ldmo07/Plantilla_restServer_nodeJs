const { response, request } = require('express');
const Usuario = require('../models/usuario.model');
const bcryptjs = require('bcryptjs');


const usuariosGet = async (req = request, res = response) => {

    //const { q, name = 'No Name', apikey, page = 1, limit } = req.query;
    const {limite = 5, desde = 0} = req.query;

    const query = {estado:true} // para filtrar los usuarios que el estado este en true

    // const usuarios = await Usuario.find(query)
    //       .skip(Number(desde))
    //       .limit(Number(limite));
    
    // const total = await Usuario.countDocuments(query);

    const [total,usuarios] = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query)
          .skip(Number(desde))
          .limit(Number(limite))
    ])

    return res.json({
        total,
       usuarios
    });
};

const usuariosPut = async (req, res = response) => {

    const { id } = req.params;
    const {_id, password, google,correo, ...resto } = req.body;

    if (password) {
        //encriptar la contraseña
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync(password, salt);
    }

    const usuario = await Usuario.findByIdAndUpdate(id, resto);

    return res.status(500).json(usuario);
};

const usuariosPost = async (req, res = response) => {



    const { nombre, correo, password, rol } = req.body;

    //creo instancia del usuario
    const usuario = new Usuario({
        nombre, correo, password, rol
    });

    //verificar si existe el correo
    // const existeEmail  = await Usuario.findOne({ correo });

    // if(existeEmail){

    //     return res.status(400).json({
    //         msg : 'Ese correo ya esta registrado'
    //     });
    // }

    //encriptar la contraseña
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync(password, salt);

    //mando a guardar el usuario a bd
    await usuario.save();

    return res.status(201).json({
        usuario
    });
};

const usuariosDelete = async (req, res = response) => {

    const {id}  =  req.params;

    //Borrado Fisico
    //const usuario = await Usuario.findByIdAndDelete(id);

    //Borrado Fisico
    const usuario = await Usuario.findByIdAndUpdate(id,{estado:false});

    //extraigo de la request el usuario autenticado esta informacion la agregue en el validar-jwt
    //const usuarioAutenticado = req.usuario;


    return res.json(usuario);
};

const usuariosPatch = (req, res = response) => {
    return res.json({
        msg: "patch API"
    });
};

module.exports = {
    usuariosGet,
    usuariosPut,
    usuariosPost,
    usuariosDelete,
    usuariosPatch

}