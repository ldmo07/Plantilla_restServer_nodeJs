const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos } = require('../middlewares/validar-campos');
const { cargarArchivo, actualizarImagen, mostrarImagen, actualizarImagenCloudinary } = require('../controllers/upload.controller');
const { coleccionesPermitidas } = require('../helpers');
const { validarArchivoSubir } = require('../middlewares');

const router = Router();

router.post('/',validarArchivoSubir,cargarArchivo);

//#region  IMAGENES SERVIDOR LOCAL
//ESTE ENDPOINT ACTUALIZA O SUBE IMAGENES AL SERVIDOR FISICO SI DESEA ESTA FUNCIONALIDA DESCOMNETE EL CODIGO Y COMENTE EL DE ABAJO
router.put('/:coleccion/:id',[
    validarArchivoSubir,
    check('id','El id debe ser un id de mongo').isMongoId(),
    check('coleccion').custom(c=>coleccionesPermitidas(c,['usuarios','productos'] )),
    validarCampos
],actualizarImagen);
//#endregion

//#region  IMAGENES CLOUDINARY
//ESTE ENDPOINT ACTUALIZA O SUBE IMAGENES AL SERVIDOR DE CLOUDINARY SI DESEA ESTA FUNCIONALIDA DESCOMNETE EL CODIGO Y COMENTE EL DE ARRIBA
// router.put('/:coleccion/:id',[
//     validarArchivoSubir,
//     check('id','El id debe ser un id de mongo').isMongoId(),
//     check('coleccion').custom(c=>coleccionesPermitidas(c,['usuarios','productos'] )),
//     validarCampos
// ],actualizarImagenCloudinary);

//#endregion

router.get('/:coleccion/:id',[ check('id','El id debe ser un id de mongo').isMongoId(),
check('coleccion').custom(c=>coleccionesPermitidas(c,['usuarios','productos'] )),
validarCampos],mostrarImagen)

module.exports = router;