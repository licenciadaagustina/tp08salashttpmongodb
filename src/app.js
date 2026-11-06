require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

// Importar rutas
const apiRoutes = require('./routes/api.routes');
const webRoutes = require('./routes/web.routes');

const app = express();

// Configuración de Motor de Plantillas (EJS)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middlewares para procesar datos
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Validar variable de entorno MONGO_URI
if (!process.env.MONGO_URI) {
  console.error('ERROR: MONGO_URI no está definida en las variables de entorno.');
  process.exit(1);
}

// Conexión a MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Conexión a MongoDB Atlas exitosa'))
  .catch((err) => console.error('Error al conectar a MongoDB:', err));

// Rutas
app.use('/api', apiRoutes);
app.use('/', webRoutes);

// Manejo de rutas no encontradas (404)
app.use((req, res, next) => {
  res.status(404).render('index', { 
    reservas: [], 
    valores: {}, 
    error: 'Ruta no encontrada' 
  });
});

// Middleware de manejo de errores global
app.use((err, req, res, next) => {
  console.error(err.stack);
  const status = err.status || 500;
  res.status(status).json({ error: err.message || 'Error interno del servidor' });
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});

// Cierre elegante (Graceful Shutdown)
process.on('SIGTERM', () => {
  console.log('Recibido SIGTERM. Cerrando servidor y conexión a base de datos...');
  server.close(async () => {
    await mongoose.connection.close();
    console.log('Proceso terminado de forma segura.');
    process.exit(0);
  });
});