const mongoose = require('mongoose');

const HoraireSchema = new mongoose.Schema({
  ligne: { type: mongoose.Schema.Types.ObjectId, ref: 'Ligne', required: true },
  arret: { type: mongoose.Schema.Types.ObjectId, ref: 'Arret', required: true },
  heures: [{ type: String, required: true }] // Format: 'HH:mm'
});

module.exports = mongoose.model('Horaire', HoraireSchema); 