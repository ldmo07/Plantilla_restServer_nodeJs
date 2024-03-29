const Role = require('../models/role.model');
const Usuario = require('../models/usuario.model');
const {Categoria, Producto} = require('../models');
const esRolValido = async (rol = '') => {
    const existeRol = await Role.findOne({ rol });
    if (!existeRol) {
        throw new Error(`El Rol ${rol} no esta registrado en bd`);
    }
}

const emailExiste = async (correo = '') => {
    const existeEmail = await Usuario.findOne({ correo });

    if (existeEmail) {

        throw new Error(`El Email ${correo} ya esta registrado`);
    }
}

const existeUsuarioPorId = async (id ) => {
    const existeUsuario = await Usuario.findById(id);

    if (!existeUsuario) {

        throw new Error(`El id ${id} no existe`);
    }
}

const existeCategoriaPorId = async (id ) => {
    const existeCategoria = await Categoria.findById(id);

    if (!existeCategoria) {

        throw new Error(`El id ${id} no existe`);
    }
}

const existeProductoPorId = async (id ) => {
    const existeProducto = await Producto.findById(id);

    if (!existeProducto) {

        throw new Error(`El id ${id} no existe`);
    }
}

const coleccionesPermitidas =  (coleccion='',colecciones = []) => {
    
    const incluida  = colecciones.includes(coleccion);

    if(!incluida){
        throw new Error(`La coleccion ${coleccion} no es permitida, las colecciones permitidas son => ${colecciones}`);
    }

    return true;
}

module.exports = {
    esRolValido,
    emailExiste,
    existeUsuarioPorId,
    existeCategoriaPorId,
    existeProductoPorId,
    coleccionesPermitidas
}