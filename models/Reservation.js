const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  utilisateur: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  transport: { type: mongoose.Schema.Types.ObjectId, ref: 'Transport', required: true },
  date: { type: Date, required: true },
  destination: { type: String, required: true },
  positionActuelle: {
    lat: { type: Number },
    lng: { type: Number }
  },
  statut: { type: String, enum: ['en attente', 'confirmée', 'annulée'], default: 'en attente' }
});

module.exports = mongoose.model('Reservation', reservationSchema);