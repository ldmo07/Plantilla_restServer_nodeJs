const {response,request} = require('express');

const usuariosGet = (req = request, res = response) => {
    
     const {q,name='No Name',apikey,page=1,limit} = req.query;
    return  res.json({
        msg:"get API - controller",
        q,
        name,
        apikey,
        page,
        limit
    });
};

const usuariosPut = (req, res = response) => {

    const {id} = req.params;

    return res.status(500).json({
        msg:"put API",
       id
    });
};

const usuariosPost = (req, res = response) => {

    const {nombre , edad} = req.body;

    return res.status(201).json({
        msg:"post API",
        nombre,
        edad
    });
};

const usuariosDelete = (req, res = response) => {
    return res.json({
        msg:"delete API"
    });
};

const usuariosPatch = (req, res = response) => {
    return res.json({
        msg:"patch API"
    });
};

module.exports = {
    usuariosGet,
    usuariosPut,
    usuariosPost,
    usuariosDelete,
    usuariosPatch

}