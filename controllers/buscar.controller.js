const { response, json } = require("express");
const { Usuario, Categoria, Producto } = require("../models");
const { ObjectId } = require('mongoose').Types;

const coleccionesPermitidas = [
    'usuarios',
    'categorias',
    'productos',
    'roles'
];


const buscarUsuarios = async (termino = '', res = response) => {

    const esMongoID = ObjectId.isValid(termino); // True o False

    if (esMongoID) {

        const usuario = await Usuario.findById(termino);

        return res.json({
            results: (usuario) ? [usuario] : []
        });
    }

    console.log("Pasoo");

    //esta expresion regular lo que hace es que no le importe que sea mayuscula o minuscula el termino de busqueda
    const regex = new RegExp(termino, 'i');

    const usuarios = await Usuario.find({
        $or: [{ nombre: regex }, { correo: regex }],
        $and: [{ estado: true }]
    });

    return res.json({
        results: usuarios
    });

}

const buscarCategorias = async (termino = '', res = response) => {

    const esMongoID = ObjectId.isValid(termino); // True o False

    if (esMongoID) {

        const categoria = await Categoria.findById(termino);

        return res.json({
            results: (categoria) ? [categoria] : []
        });
    }


    //esta expresion regular lo que hace es que no le importe que sea mayuscula o minuscula el termino de busqueda
    const regex = new RegExp(termino, 'i');

    const categorias = await Categoria.find({ nombre: regex, estado: true });

    return res.json({
        results: categorias
    });

}

const buscarProductos = async (termino = '', res = response) => {

    const esMongoID = ObjectId.isValid(termino); // True o False

    if (esMongoID) {

        const producto = await Producto.findById(termino).populate('categoria','nombre');

        return res.json({
            results: (producto) ? [producto] : []
        });
    }


    //esta expresion regular lo que hace es que no le importe que sea mayuscula o minuscula el termino de busqueda
    const regex = new RegExp(termino, 'i');

    const productos = await Producto.find({ nombre: regex, estado: true }).populate('categoria','nombre');

    return res.json({
        results: productos
    });

}

const buscar = async (req, res = response) => {

    const { coleccion, termino } = req.params;

    if (!coleccionesPermitidas.includes(coleccion)) {

        return res.status(400).json({
            msg: `La colecciones permitidas son : ${coleccionesPermitidas}`
        })
    }

    switch (coleccion) {

        case 'usuarios':
            buscarUsuarios(termino, res);
            break;
        case 'categorias':
            buscarCategorias(termino, res);
            break;
        case 'productos':
            buscarProductos(termino, res);
            break;
        default:
            res.status(500).json({
                msg: 'Se le olvido hacer esta Busqueda'
            })
    }
}

module.exports = {
    buscar
}