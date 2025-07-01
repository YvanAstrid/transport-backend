const mongoose = require('mongoose');

const chauffeurSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    numeroPermis: {
        type: String,
        required: true,
        unique: true
    },
    dateObtentionPermis: {
        type: Date,
        required: true
    },
    typePermis: {
        type: String,
        enum: ['B', 'C', 'D', 'BE'],
        required: true
    },
    experience: {
        type: Number,
        default: 0
    },
    noteMoyenne: {
        type: Number,
        min: 0,
        max: 5,
        default: 0
    },
    nombreAvis: {
        type: Number,
        default: 0
    },
    vehicules: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vehicule'
    }],
    status: {
        type: String,
        enum: ['disponible', 'en_course', 'indisponible'],
        default: 'disponible'
    },
    zoneOperation: [{
        type: String,
        enum: ['urbain', 'rural', 'interurbain']
    }],
    documents: {
        photoPermis: {
            type: String, // URL ou chemin du fichier
            required: true
        },
        photoIdentite: {
            type: String,
            required: true
        }
    },
    historique: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Trip'
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Chauffeur', chauffeurSchema);
