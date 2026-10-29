// 1. Cargar las variables de entorno al inicio absoluto de la aplicación
require('dotenv').config();

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');

const app = express();

// 2. Diagnóstico temporal para verificar si lee el .env
console.log("--- DIAGNÓSTICO .ENV ---");
console.log("Directorio actual:", __dirname);
console.log("MONGO_URI detectado:", process.env.MONGO_URI ? "¡Sí existe y se cargó!" : "UNDEFINED (No se encontró el .env)");
console.log("--------------------------");

// Configuraciones de vistas y middlewares
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Importar rutas
const webRoutes = require('./routes/web.routes');
const apiRoutes = require('./routes/api.routes');

app.use('/', webRoutes);
app.use('/api/reservas', apiRoutes);

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

// Conexión a MongoDB Atlas
mongoose.connect(MONGO_URI)
    .then(() => {
        console.log("¡Conectado exitosamente a MongoDB!");
        app.listen(PORT, () => {
            console.log(`Servidor corriendo en el puerto ${PORT}`);
        });
    })
    .catch((error) => {
        console.error("Error al conectar a MongoDB:", error);
    });