const mongoose = require('mongoose');

const paiementSchema = new mongoose.Schema({
  reservation: { type: mongoose.Schema.Types.ObjectId, ref: 'Reservation', required: true },
  montant: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  statut: { type: String, enum: ['en attente', 'effectué', 'échoué'], default: 'en attente' }
});

module.exports = mongoose.model('Paiement', paiementSchema);