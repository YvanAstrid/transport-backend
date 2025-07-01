const mongoose = require('mongoose');

const administrateurSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    niveauAcces: {
        type: String,
        enum: ['standard', 'super_admin'],
        default: 'standard'
    },
    departement: {
        type: String,
        enum: ['gestion', 'sécurité', 'support', 'marketing'],
        required: true
    },
    permissions: {
        gestionUtilisateurs: Boolean,
        gestionChauffeurs: Boolean,
        gestionVehicules: Boolean,
        gestionTrajets: Boolean,
        gestionFinances: Boolean
    },
    historiqueActions: [{
        action: String,
        description: String,
        date: {
            type: Date,
            default: Date.now
        }
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

module.exports = mongoose.model('Administrateur', administrateurSchema);
