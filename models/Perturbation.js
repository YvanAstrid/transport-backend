const mongoose = require('mongoose');

const PerturbationSchema = new mongoose.Schema({
  ligne: { type: mongoose.Schema.Types.ObjectId, ref: 'Ligne' },
  description: { type: String, required: true },
  dateDebut: { type: Date, required: true },
  dateFin: { type: Date }
});

module.exports = mongoose.model('Perturbation', PerturbationSchema); 