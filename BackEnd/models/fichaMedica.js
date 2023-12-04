const mongoose = require('mongoose');

const ObservacionSchema = new mongoose.Schema({
    fecha: Date,
    especialista: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Especialista'
    },
    diagnostico: String,
    notas: String,
    recomendaciones: String,
    asistencia: Boolean,
    justificacion: String
});

const HistorialMedicoSchema = new mongoose.Schema({
    diagnosticoAnterior: String,
    EnfermedadAnterior: String
});

const FichaMedicaSchema = new mongoose.Schema({
    Paciente: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Paciente'
    },
    observaciones: [ObservacionSchema],
    historialMedico: [HistorialMedicoSchema],
    fechaCreacion: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('FichaMedica',FichaMedicaSchema); //Modulo