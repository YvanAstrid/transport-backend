const mongoose = require('mongoose');

const transportSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  type: { type: String, required: true },
  capacite: { type: Number, required: true },
});

module.exports = mongoose.model('Transport', transportSchema);