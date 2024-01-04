const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos, validarJWT, esAdminRole } = require('../middlewares/');
const { crearCategoria, borrarCategoria, actualizarCategoria, obtenerCategoria, obtenerCategorias } = require('../controllers/categorias.controller');
const { existeCategoriaPorId } = require('../helpers/db-validators');

const router = Router();

//obtiene todas las categorias - publico
router.get('/', obtenerCategorias);

//obtiene una categoria por id - publico
router.get('/:id', [
    check('id', 'No es un id de Mongo Valido').isMongoId(),
    check('id').custom(existeCategoriaPorId),
    validarCampos
], obtenerCategoria);

//crea una categoria - privado - cualquier persona con un token valido
router.post('/', [validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos],
    crearCategoria);

//actualiza una categoria - privado - cualquier persona con un token valido
router.put('/:id', [validarJWT,
    check('nombre', 'El nombre es obligatoria').not().isEmpty(),
    check('id').custom(existeCategoriaPorId),
    validarCampos],
    actualizarCategoria);


//elimina una categoria - privado - solo si es Admin
router.delete('/:id', [ validarJWT,
    esAdminRole,
    check('id','No es un id de mongo valido').isMongoId(),
    check('id').custom(existeCategoriaPorId),
    validarCampos], borrarCategoria);


module.exports = router;