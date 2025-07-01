const mongoose = require('mongoose');

const LigneSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  type: { type: String, enum: ['bus', 'tram', 'metro', 'train', 'avion', 'autre'], required: true },
  arrets: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Arret' }],
  numero: { type: String },
  couleur: { type: String }
});

module.exports = mongoose.model('Ligne', LigneSchema); 