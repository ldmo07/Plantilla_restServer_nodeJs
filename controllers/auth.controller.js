const { response, json } = require('express');
const Usuario = require('../models/usuario.model');
const bcryptjs = require('bcryptjs');
const { generarJWT } = require('../helpers/generar-jwt');
const { googleVerify } = require('../helpers/google-verify');

const login = async (req, res = response) => {

    const { correo, password } = req.body;

    try {

        //verifica si el email existe
        const usuario = await Usuario.findOne({ correo });

        if (!usuario) {
            return res.status(400).json({
                msg: 'Usuario / password no son correctos - correo'
            })
        }

        //verificar si el usuario esta activo
        if (!usuario.estado) {
            return res.status(400).json({
                msg: 'Usuario / password no son correctos - estado:false'
            })
        }

        //verificamos la contraseña
        const validPassword = bcryptjs.compareSync(password, usuario.password);

        if (!validPassword) {
            return res.status(400).json({
                msg: 'Usuario / password no son correctos - password'
            })
        }


        //generar el jwt
        const token = await generarJWT(usuario.id);

        res.json({
            usuario,
            token
        });

    } catch (error) {

        console.log(error);
        res.status(500).json({
            msg: 'hable con el administrador'
        });
    }

}

const googleSingIn = async (req, res = response) => {
    const { id_token } = req.body;

    try {

        const { nombre, img, correo } = await googleVerify(id_token);

        let usuario = await Usuario.findOne({ correo });

        

        if (!usuario) {
            //tengo que crearlo
            const data = {
                nombre,
                correo,
                password: ':P',
                img,
                google: true,
                rol:'USER_ROLE'
            };

            
            usuario = new Usuario(data);
            console.log(usuario);
            await usuario.save();
        }

        if (!usuario.estado) {
            res.status(401).json({
                ok: false,
                msg: 'Hable con el Admin Usuario bloqueado'
            })
        }

        //genera el jwt
        const token = await generarJWT(usuario.id);

        res.json({
            usuario,
            token
        });

    } catch (error) {

        res.status(400).json({
            ok: false,
            msg: 'El token de google no se pudo verificar',
        })
    }


}


module.exports = {
    login,
    googleSingIn
}