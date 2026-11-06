const express = require('express');
const mongoose = require('mongoose');
const apiRoutes = require('./routes/api.routes');
const webRoutes = require('./routes/web.routes');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/reservas_salas_u8';

// Middlewares para procesar datos de formularios y JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Configuración del motor de vistas EJS
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

// 1. Montaje de rutas (API bajo /api/reservas y Web en la raíz)
app.use('/api/reservas', apiRoutes);
app.use('/', webRoutes);

// 2. Middleware 404 específico para la API (devuelve JSON)
app.use('/api/*', (req, res) => {
  res.status(404).json({ error: 'Recurso no encontrado' });
});

// 3. Middleware 404 general para la web (si tenés una vista de error 404)
app.use((req, res, next) => {
  res.status(404).render('404', { mensaje: 'Página no encontrada' }); // Ajustá según tu vista si tenés una
});

// 4. Middleware global de errores (4 parámetros)
app.use((err, req, res, next) => {
  console.error(err.stack);

  const status = err.status || err.statusCode || 500;

  // Si la petición es de la API, responder estrictamente en JSON y con 500 genérico (excepto 400 de entrada)
  if (req.originalUrl.startsWith('/api')) {
    return res.status(status).json({
      error: status === 400 ? err.message : 'Error interno del servidor'
    });
  }

  // Si es la interfaz web
  res.status(status).render('error', { mensaje: 'Ocurrió un error inesperado en el servidor' });
});

let server;

// Función para iniciar el servidor esperando primero a MongoDB (Punto 1 de la rúbrica)
async function iniciarServidor() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Conectado a MongoDB Atlas con éxito.');

    server = app.listen(PORT, () => {
      console.log(`Servidor corriendo en el puerto ${PORT}`);
    });
  } catch (error) {
    console.error('Error al conectar con MongoDB:', error.message);
    process.exit(1); // Cierra sin abrir puerto ni dar falso éxito
  }
}

// Cierre ordenado (Graceful Shutdown) para SIGINT y SIGTERM
function cerrarServidor(senal) {
  console.log(`\nRecibida señal ${senal}. Cerrando servidor HTTP y MongoDB ordenadamente...`);
  if (server) {
    server.close(async () => {
      await mongoose.connection.close();
      console.log('Conexiones cerradas correctamente.');
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
}

process.on('SIGINT', () => cerrarServidor('SIGINT'));
process.on('SIGTERM', () => cerrarServidor('SIGTERM'));

iniciarServidor();