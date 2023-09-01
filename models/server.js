const express = require('express');
const cors = require('cors');
const { dbConnection } = require('../database/config');

class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.usuariosPath = '/api/usuarios';

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
    }

    routes() {

        this.app.use(this.usuariosPath, require('../routes/usuarios.routes'))


    }

    listen() {

        this.app.listen(this.port, () => {
            console.log('Servidor corriendo en el puerto ', this.port);
        });
    }
}

module.exports = Server;