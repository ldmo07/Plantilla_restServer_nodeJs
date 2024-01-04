const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos, validarJWT, esAdminRole } = require('../middlewares/');
const { existeProductoPorId, existeCategoriaPorId } = require('../helpers/db-validators');
const { obtenerProductos, obtenerProducto, crearProducto, actualizarProducto, borrarProducto } = require('../controllers/productos.controller');

const router = Router();

//obtiene todos los productos - publico
router.get('/', obtenerProductos);

//obtiene un producto por id - publico
router.get('/:id', [
    check('id', 'No es un id de Mongo Valido').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos
], obtenerProducto);

//crea un producto - privado - cualquier persona con un token valido
router.post('/', [validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('categoria', 'No es un id de Mongo Valido').isMongoId(),
    check('categoria').custom(existeCategoriaPorId),
    validarCampos],
    crearProducto);

//actualiza un producto - privado - cualquier persona con un token valido
router.put('/:id', [validarJWT,
    //check('categoria', 'No es un id de Mongo Valido').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos],
    actualizarProducto);


//elimina un producto - privado - solo si es Admin
router.delete('/:id', [ validarJWT,
    esAdminRole,
    check('id','No es un id de mongo valido').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos], borrarProducto);


module.exports = router;