const reservaService = require('../services/reserva.service');

const renderInicio = async (req, res, next) => {
  try {
    const reservas = await reservaService.listarReservas();
    return res.render('index', { 
      reservas, 
      valores: {}, 
      error: null 
    });
  } catch (error) {
    console.error('DETALLE DEL ERROR WEB:', error); // Esto lo imprimirá en la terminal
    return res.status(500).send('Error al cargar las vistas de reservas: ' + error.message);
  }
};

const crearWeb = async (req, res, next) => {
  try {
    await reservaService.crearReserva(req.body);
    return res.redirect(302, '/');
  } catch (error) {
    const reservas = await reservaService.listarReservas();
    return res.status(400).render('index', {
      reservas,
      valores: req.body,
      error: error.message
    });
  }
};

const renderEstado = async (req, res, next) => {
  try {
    const totalReservas = await reservaService.contarReservas();
    return res.render('estado', { totalReservas });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  renderInicio,
  crearWeb,
  renderEstado
};