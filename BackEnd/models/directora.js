const mongoose = require('mongoose');

const directoraSchema = new mongoose.Schema({
    Rut: String,
    pass: String,
    nombre: String,
    apellido: String,
    email: String,
    cargo: String,
    fichasMedicas: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'FichaMedica'
    }],
});

module.exports = mongoose.model('Directora',directoraSchema); //Modulo