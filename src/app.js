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

// --- NUEVO: Middleware para capturar JSON mal formado (Error 400) ---
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return res.status(400).json({ error: "El formato del JSON enviado es inválido o está mal formado." });
    }
    next(err);
});
// -------------------------------------------------------------------

// Importar rutas
const webRoutes = require('./routes/web.routes');
const apiRoutes = require('./routes/api.routes');

app.use('/', webRoutes);
app.use('/api/reservas', apiRoutes);

// --- NUEVO: Middleware general de errores de 4 parámetros para la API ---
app.use((err, req, res, next) => {
    console.error("Error global capturado:", err.stack);
    res.status(500).json({ error: "Ocurrió un error interno en el servidor." });
});
// -----------------------------------------------------------------------

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

let server;

// Conexión a MongoDB Atlas (espera conexión antes de abrir el puerto)
mongoose.connect(MONGO_URI)
    .then(() => {
        console.log("¡Conectado exitosamente a MongoDB!");
        server = app.listen(PORT, () => {
            console.log(`Servidor corriendo en el puerto ${PORT}`);
        });
    })
    .catch((error) => {
        console.error("Error al conectar a MongoDB:", error);
        process.exit(1);
    });

// Cierre ordenado ante señales del sistema (SIGINT / SIGTERM)
const gracefulShutdown = async (signal) => {
    console.log(`\nRecibida señal ${signal}. Cerrando servidor y conexión a base de datos...`);
    try {
        if (server) {
            server.close();
        }
        await mongoose.connection.close();
        console.log("Conexión a MongoDB cerrada correctamente.");
        process.exit(0);
    } catch (err) {
        console.error("Error al cerrar la conexión a MongoDB:", err);
        process.exit(1);
    }
};

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));