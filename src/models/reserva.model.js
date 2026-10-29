const mongoose = require('mongoose');

const reservaSchema = new mongoose.Schema({
    estudiante: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true
    },
    sala: {
        type: String,
        required: true,
        enum: ['Sala Norte', 'Sala Sur', 'Sala Multimedia']
    },
    fecha: {
        type: String,
        required: true,
        trim: true
    },
    turno: {
        type: String,
        required: true,
        enum: ['Mañana', 'Tarde', 'Noche']
    },
    personas: {
        type: Number,
        required: true,
        min: 1,
        max: 6
    },
    estado: {
        type: String,
        required: true,
        default: 'pendiente',
        enum: ['pendiente', 'confirmada']
    }
});

module.exports = mongoose.model('Reserva', reservaSchema);