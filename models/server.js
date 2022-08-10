const express = require('express');
const cors = require('cors');
const { dbConnection } = require('../database/config')

class Server {
    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.usuariosPath = '/api/usuarios';
        // Conectar a base de datos
        this.conectarDB();
        //Middlewares
        this.middlewares();
        // Rutas de mi aplicacion
        this.routes();
    }
    middlewares() {
        //CORS
        this.app.use(cors());
        //LECTURA
        this.app.use(express.json())
            //Directorio Publico
        this.app.use(express.static('public'));
    }
    async conectarDB() {
        await dbConnection();
    }

    routes() {
        this.app.use(this.usuariosPath, require('../routes/usuarios'));
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log('Servidor corriendo en puerto', this.port);
        });
    }
}

module.exports = Server;