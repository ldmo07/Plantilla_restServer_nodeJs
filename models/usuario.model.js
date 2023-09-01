
const { Schema,model} = require('mongoose');

const UsuarioSchema  = Schema ({
    nombre : {
        type: String,
        required: [true,'El nombre es obligatorio']
    },

    correo : {
        type: String,
        required: [true,'El correo es obligatorio'],
        unique : true
    },

    password : {
        type: String,
        required: [true,'El password es obligatorio']
    },

    imagen : {
        type: String,
    },
    
    rol : {
        type: String,
        required: [true,'El Nombre es obligatorio'],
        enum : ['ADMIN_ROLE','USER_ROLE','VENTAS_ROLE']
    },

    estado : {
        type: Boolean,
        default : true
    },

    google : {
        type: Boolean,
        default : false
    },

});

//sobreescribo el metodo para excluir el password y el _v del modelo al momento de imprimirlo
UsuarioSchema.methods.toJSON = function(){
    const {__v,password,...usuario} = this.toObject();
    return usuario;
}

module.exports = model('Usuario',UsuarioSchema);