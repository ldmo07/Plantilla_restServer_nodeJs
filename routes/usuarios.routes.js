
const { Router } = require('express');
const { usuariosGet, usuariosPut, usuariosPost, usuariosDelete, usuariosPatch } = require('../controllers/usuarios.controller');
const { check } = require('express-validator');

const { esRolValido, emailExiste, existeUsuarioPorId } = require('../helpers/db-validators');

//importacion sin utilizar el archivo de barril
// const { validarCampos } = require('../middlewares/validar-campos');
// const { validarJWT } = require('../middlewares/validar-jwt');
// const { esAdminRole, tieneRole } = require('../middlewares/validar-roles');

//importacion utilizando el archivo de barril
const { validarCampos , validarJWT, esAdminRole, tieneRole } = require('../middlewares');

const router = Router();

router.get('/', usuariosGet);

router.put('/:id', [
    check('id', 'No es un Id valido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    check('rol').custom(esRolValido),
    validarCampos
], usuariosPut);

router.post('/', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'El password es obligatorio y mas de 6 caracteres').not().isEmpty().isLength({ min: 6 }),
    check('correo', 'El correo no es valido').isEmail().custom(emailExiste),
    //check('rol','No es un rol valido').isIn(['ADMIN_ROLE','USER_ROLE']),
    check('rol').custom(esRolValido),
    validarCampos
], usuariosPost);

router.delete('/:id', [
    validarJWT,
    //esAdminRole,
    tieneRole('ADMIN_ROLE', 'VENTAS_ROLE'),
    check('id', 'No es un Id valido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    validarCampos
], usuariosDelete);

router.patch('/', usuariosPatch);


module.exports = router;
