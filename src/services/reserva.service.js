const Reserva = require('../models/reserva.model');

/**
 * Valida de forma estricta los tipos originales de entrada antes de castear
 */
const validarEntradaReserva = (data) => {
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    const error = new Error('Cuerpo de la solicitud inválido o ausente');
    error.status = 400;
    throw error;
  }

  const { estudiante, email, sala, fecha, turno, personas } = data;

  // 1. Validar que personas no sea booleano, array, objeto, nulo ni string vacío
  if (
    personas === undefined ||
    personas === null ||
    typeof personas === 'boolean' ||
    Array.isArray(personas) ||
    typeof personas === 'object' ||
    (typeof personas === 'string' && personas.trim() === '')
  ) {
    const error = new Error('El campo personas debe ser un número entero válido (1-6)');
    error.status = 400;
    throw error;
  }

  const numPersonas = Number(personas);
  if (!Number.isInteger(numPersonas) || numPersonas < 1 || numPersonas > 6) {
    const error = new Error('El campo personas debe ser un entero entre 1 y 6');
    error.status = 400;
    throw error;
  }

  // 2. Validar strings obligatorios y trim
  if (!estudiante || typeof estudiante !== 'string' || estudiante.trim() === '') {
    const error = new Error('El campo estudiante es obligatorio');
    error.status = 400;
    throw error;
  }

  if (!email || typeof email !== 'string' || !email.includes('@')) {
    const error = new Error('El campo email debe ser válido y contener @');
    error.status = 400;
    throw error;
  }

  if (!fecha || typeof fecha !== 'string' || fecha.trim() === '') {
    const error = new Error('El campo fecha es obligatorio');
    error.status = 400;
    throw error;
  }

  // 3. Copia explícita de exactamente los 6 campos admitidos (ignora _id, estado extra)
  return {
    estudiante: estudiante.trim(),
    email: email.trim(),
    sala,
    fecha: fecha.trim(),
    turno,
    personas: numPersonas
  };
};

const listarReservas = async (filtroSala) => {
  const query = {};

  if (filtroSala !== undefined && filtroSala !== null) {
    // Validar que no sea un array u objeto (ej. si mandan ?sala=A&sala=B repetido) -> 400
    if (Array.isArray(filtroSala) || typeof filtroSala === 'object') {
      const error = new Error('El filtro de sala debe ser un único texto');
      error.status = 400;
      throw error;
    }

    if (typeof filtroSala === 'string') {
      const salaLimpia = filtroSala.trim();
      // Si tras el trim queda vacío, se trata como ausencia de filtro y devuelve todo
      if (salaLimpia !== '') {
        query.sala = salaLimpia;
      }
    }
  }

  return await Reserva.find(query);
};

const obtenerReservaPorId = async (id) => {
  return await Reserva.findById(id);
};

const crearReserva = async (data) => {
  const datosValidados = validarEntradaReserva(data);
  const nuevaReserva = new Reserva(datosValidados);
  return await nuevaReserva.save();
};

const contarReservas = async () => {
  return await Reserva.countDocuments();
};

module.exports = {
  validarEntradaReserva,
  listarReservas,
  obtenerReservaPorId,
  crearReserva,
  contarReservas
};