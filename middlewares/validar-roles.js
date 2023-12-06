const { response } = require("express")


const esAdminRole = (req, res = response, next) => {

    //valido que exista la informacion del usuario logeado que previamnete agregue en el middleware de validar-jwt 
    //este middleware se tiene que llamar en las rutas despues del middleware de validar-jwt
    if (!req.usuario) {
        return res.status(500).json({
            msg: 'Se quiere verificar el rol sin validar el token primero'
        })
    }

    const { rol, nombre } = req.usuario;

    if (rol !== 'ADMIN_ROLE') {
        return res.status(401).json({
            msg: `${nombre} no es Administrador - No puede hacer esto`
        })
    }

    next();
}

const tieneRole = (...roles) => {

    return (req, res = response, next) => {

        //valido que exista la informacion del usuario logeado que previamnete agregue en el middleware de validar-jwt 
        //este middleware se tiene que llamar en las rutas despues del middleware de validar-jwt
        if (!req.usuario) {
            return res.status(500).json({
                msg: 'Se quiere verificar el rol sin validar el token primero'
            })
        }


        if (!roles.includes( req.usuario.rol)) {
            return res.status(401).json({
                msg: `El servicio requiere uno de estos roles ${roles}`
            });
        }


        next();
    }
}

module.exports = {
    esAdminRole,
    tieneRole
}
