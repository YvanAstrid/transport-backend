const Chauffeur = require('../models/Chauffeur');
const User = require('../models/User');
const Trip = require('../models/Trip');
const { validationResult } = require('express-validator');

exports.createChauffeur = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { numeroPermis, dateObtentionPermis, typePermis, zoneOperation } = req.body;
        const { user } = req;

        // Vérifier si l'utilisateur est déjà chauffeur
        const existingChauffeur = await Chauffeur.findOne({ user: user._id });
        if (existingChauffeur) {
            return res.status(400).json({ message: 'Cet utilisateur est déjà chauffeur' });
        }

        const chauffeur = new Chauffeur({
            user: user._id,
            numeroPermis,
            dateObtentionPermis,
            typePermis,
            zoneOperation
        });

        await chauffeur.save();
        user.role = 'chauffeur';
        user.chauffeur = chauffeur._id;
        await user.save();

        res.status(201).json({ chauffeur });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getChauffeurProfile = async (req, res) => {
    try {
        const chauffeur = await Chauffeur.findOne({ user: req.user._id })
            .populate('user', 'nom prenom email telephone')
            .populate('vehicules')
            .populate('historique');

        if (!chauffeur) {
            return res.status(404).json({ message: 'Chauffeur non trouvé' });
        }

        res.json({ chauffeur });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateChauffeurProfile = async (req, res) => {
    try {
        const { numeroPermis, dateObtentionPermis, typePermis, zoneOperation } = req.body;
        const chauffeur = await Chauffeur.findOne({ user: req.user._id });

        if (!chauffeur) {
            return res.status(404).json({ message: 'Chauffeur non trouvé' });
        }

        chauffeur.numeroPermis = numeroPermis || chauffeur.numeroPermis;
        chauffeur.dateObtentionPermis = dateObtentionPermis || chauffeur.dateObtentionPermis;
        chauffeur.typePermis = typePermis || chauffeur.typePermis;
        chauffeur.zoneOperation = zoneOperation || chauffeur.zoneOperation;

        await chauffeur.save();
        res.json({ chauffeur });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAvailableChauffeurs = async (req, res) => {
    try {
        const chauffeurs = await Chauffeur.find({ status: 'disponible' })
            .populate('user', 'nom prenom noteMoyenne')
            .populate('vehicules');

        res.json({ chauffeurs });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.searchChauffeurs = async (req, res) => {
    try {
        const { nom } = req.query;
        const chauffeurs = await Chauffeur.find({ nom: new RegExp(nom, 'i') });
        res.json(chauffeurs);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
