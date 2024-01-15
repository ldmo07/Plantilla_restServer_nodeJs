const dbValidators = require('./db-validators');
const generarJWT = require('./generar-jwt');
const googkeVerify = require('./google-verify');
const subirArchivo = require('./subir-archivo');

module.exports = {
    ...dbValidators,
    ...generarJWT,
    ...googkeVerify,
    ...subirArchivo
}