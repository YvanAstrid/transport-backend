const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  prenom: { type: String },
  email: { type: String, required: true, unique: true },
  motdepasse: { type: String, required: true },
  telephone: { type: String },
  role: {
    type: String,
    enum: ['client', 'chauffeur', 'controleur', 'administrateur', 'super_admin'],
    default: 'client'
  },
  status: {
    type: String,
    enum: ['actif', 'inactif', 'suspendu'],
    default: 'actif'
  },
  // Propriétés spécifiques aux chauffeurs
  chauffeur: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chauffeur',
    default: null
  },
  // Propriétés spécifiques aux administrateurs
  administrateur: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Administrateur',
    default: null
  },
  // Informations de localisation
  position: {
    latitude: Number,
    longitude: Number
  },
  // Informations de session
  lastLogin: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);