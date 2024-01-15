const express = require('express');
const cors = require('cors');
const { dbConnection } = require('../database/config');
const fileUpload = require('express-fileupload');

class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT;

        this.paths = {

            auth: '/api/auth',
            buscar : '/api/buscar',
            categorias : '/api/categorias',
            productos : '/api/productos',
            usuarios : '/api/usuarios',
            uploads : '/api/uploads'
        }

        //conectar a bd
        this.conectarBD();
        //Middlewares
        this.middlewares();

        //Rutas de aplicacion
        this.routes();


    }

    async conectarBD() {
        await dbConnection();
    }

    middlewares() {

        //cors
        this.app.use(cors());

        //lectura y parseo del body
        this.app.use(express.json());

        //llama o invoca el contenido estatico de la carpeta publica
        this.app.use(express.static('public'));

        //para manejar  carga de archivos
        this.app.use(fileUpload({
            useTempFiles : true,
            tempFileDir : '/tmp/',
            createParentPath:true
        }));
    }

    routes() {

        this.app.use(this.paths.auth, require('../routes/auth.routes'));
        this.app.use(this.paths.buscar, require('../routes/buscar.routes'));
        this.app.use(this.paths.categorias, require('../routes/categorias.routes'));
        this.app.use(this.paths.productos, require('../routes/productos.routes'));
        this.app.use(this.paths.usuarios, require('../routes/usuarios.routes'));
        this.app.use(this.paths.uploads, require('../routes/upload.routes'));
        
    }

    listen() {

        this.app.listen(this.port, () => {
            console.log('Servidor corriendo en el puerto ', this.port);
        });
    }
}

module.exports = Server;