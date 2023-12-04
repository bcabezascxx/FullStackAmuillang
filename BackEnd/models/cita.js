const mongoose = require('mongoose');

const citaSchema = new mongoose.Schema({
    fecha: {
      type: String,
      required: true
    },
    hora: {
      type: String,  
      required: true
    },
    especialistaId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Especialista', 
      required: true
    },
    pacienteId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Paciente', 
      required: true
    },
    disponibilidad: Boolean
  });

module.exports = mongoose.model('Cita',citaSchema); //Modulo