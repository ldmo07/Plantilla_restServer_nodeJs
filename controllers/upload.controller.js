const path = require('path');
const fs = require('fs');

const cloudinary = require('cloudinary').v2;
cloudinary.config(process.env.CLOUDINARY_URL);

const { response } = require("express");
const { subirArchivo } = require("../helpers");
const { Usuario, Producto } = require('../models')



const cargarArchivo = async (req, res = response) => {

    try {

        //Sobrecraga para definir extensiones que puedo subir y la ruta de destino
        //const nombre = await subirArchivo(req.files,['txt','pdf','docx','jpg','gif','png'],'archivos'); 
        const nombre = await subirArchivo(req.files, undefined, 'imgs');
        res.json({ nombre })

    } catch (error) {

        return res.status(400).json({ msg: error });
    }

}

const actualizarImagen = async (req, res = response) => {

    const { id, coleccion } = req.params;

    let modelo;

    switch (coleccion) {
        case 'usuarios':

            modelo = await Usuario.findById(id);
            if (!modelo) {
                return res.status(400).json({ msg: `No existe un usuario con el id ${id}` })
            }

            break;

        case 'productos':

            modelo = await Producto.findById(id);
            if (!modelo) {
                return res.status(400).json({ msg: `No existe un producto con el id ${id}` })
            }

            break;

        default:
            return res.status(500).json({ msg: 'Se me olvido validar esto' });
    }

    //limpio las imagenes previas
    if (modelo.img) {


        //armo la ruta de la imagen a borrar
        const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img);

        //valido si existe la el path o la imagen y la borro del servidor
        if (fs.existsSync(pathImagen)) {
            fs.unlinkSync(pathImagen);
        }
    }

    const nombre = await subirArchivo(req.files, undefined, coleccion);
    modelo.img = nombre;

    await modelo.save();

    res.json(modelo);

}


const actualizarImagenCloudinary = async (req, res = response) => {

    const { id, coleccion } = req.params;

    let modelo;

    switch (coleccion) {
        case 'usuarios':

            modelo = await Usuario.findById(id);
            if (!modelo) {
                return res.status(400).json({ msg: `No existe un usuario con el id ${id}` })
            }

            break;

        case 'productos':

            modelo = await Producto.findById(id);
            if (!modelo) {
                return res.status(400).json({ msg: `No existe un producto con el id ${id}` })
            }

            break;

        default:
            return res.status(500).json({ msg: 'Se me olvido validar esto' });
    }

    //limpio las imagenes previas
    if (modelo.img) {

        const nombreArr = modelo.img.split('/');
        const nombre = nombreArr[nombreArr.length-1];

        //obtiene la primera parte del arreglo es decir el id sin la extension y lo mando a eliminar en cloudinary
        const [public_id] = nombre.split('.');
        cloudinary.uploader.destroy(public_id);
    }

    //extraigo el path temporal del archivo que envie el usuario en la request
    const {tempFilePath} = req.files.archivo;
    //subo la imagen a cloudinary
    const {secure_url} = await cloudinary.uploader.upload(tempFilePath);

    modelo.img = secure_url;
    await modelo.save();

    res.json(modelo);

}


const mostrarImagen =  async (req,res= response) => {

    const { id, coleccion } = req.params;

    let modelo;

    switch (coleccion) {
        case 'usuarios':

            modelo = await Usuario.findById(id);
            if (!modelo) {
                return res.status(400).json({ msg: `No existe un usuario con el id ${id}` })
            }

            break;

        case 'productos':

            modelo = await Producto.findById(id);
            if (!modelo) {
                return res.status(400).json({ msg: `No existe un producto con el id ${id}` })
            }

            break;

        default:
            return res.status(500).json({ msg: 'Se me olvido validar esto' });
    }

    //limpio las imagenes previas
    if (modelo.img) {


        //armo la ruta de la imagen a mostrar
        const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img);

        //valido si existe la el path o la imagen y la muestro
        if (fs.existsSync(pathImagen)) {
          return res.sendFile(pathImagen);
        }
    }

    //armo la ruta de los modelos que no tengan imagen y muestro una imagen por defecto
    const pathImagen = path.join(__dirname, '../assets/no-image.jpg');
    res.sendFile(pathImagen);
}

module.exports = {
    cargarArchivo,
    actualizarImagen,
    actualizarImagenCloudinary,
    mostrarImagen
}