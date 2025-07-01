const mongoose = require('mongoose');

const lieuSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  nom: {
    type: String,
    required: true,
    trim: true
  },
  adresse: {
    type: String,
    required: true,
    trim: true
  },
  latitude: {
    type: Number,
    required: true
  },
  longitude: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    enum: ['maison', 'travail', 'ecole', 'commerce', 'autre'],
    default: 'autre'
  },
  favori: {
    type: Boolean,
    default: false
  },
  notes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Index pour les requêtes géospatiales
lieuSchema.index({ latitude: 1, longitude: 1 });
lieuSchema.index({ user: 1, favori: 1 });

module.exports = mongoose.model('Lieu', lieuSchema); 