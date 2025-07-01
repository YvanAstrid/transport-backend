const mongoose = require('mongoose');

const ArretSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  localisation: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true }
  },
  description: { type: String }
});

module.exports = mongoose.model('Arret', ArretSchema); 