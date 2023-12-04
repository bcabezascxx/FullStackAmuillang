const mongoose = require('mongoose');

const secretariaSchema = new mongoose.Schema({
    Rut: String,
    pass: String,
    nombre: String,
    apellido: String,
    email: String,
    cargo: String,
    estado: String,
});

module.exports = mongoose.model('Secretaria',secretariaSchema); //Modulo