const Administrateur = require('../models/Administrateur');
const User = require('../models/User');
const Chauffeur = require('../models/Chauffeur');
const Trip = require('../models/Trip');
const { validationResult } = require('express-validator');

// Vérifier si l'utilisateur est administrateur
exports.isAdmin = async (req, res, next) => {
    try {
        const admin = await Administrateur.findOne({ user: req.user._id });
        if (!admin) {
            return res.status(403).json({ message: 'Accès non autorisé' });
        }
        req.admin = admin;
        next();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createAdmin = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { departement, permissions } = req.body;
        const { user } = req;

        // Vérifier si l'utilisateur est déjà administrateur
        const existingAdmin = await Administrateur.findOne({ user: user._id });
        if (existingAdmin) {
            return res.status(400).json({ message: 'Cet utilisateur est déjà administrateur' });
        }

        const admin = new Administrateur({
            user: user._id,
            departement,
            permissions
        });

        await admin.save();
        user.role = 'administrateur';
        user.administrateur = admin._id;
        await user.save();

        res.status(201).json({ admin });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAdminProfile = async (req, res) => {
    try {
        const admin = await Administrateur.findOne({ user: req.user._id })
            .populate('user', 'nom prenom email telephone')
            .populate('historiqueActions');

        if (!admin) {
            return res.status(404).json({ message: 'Administrateur non trouvé' });
        }

        res.json({ admin });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateAdminProfile = async (req, res) => {
    try {
        const { departement, permissions } = req.body;
        const admin = await Administrateur.findOne({ user: req.user._id });

        if (!admin) {
            return res.status(404).json({ message: 'Administrateur non trouvé' });
        }

        admin.departement = departement || admin.departement;
        admin.permissions = permissions || admin.permissions;

        await admin.save();
        res.json({ admin });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Gestion des utilisateurs
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find()
            .populate('chauffeur')
            .populate('administrateur');
        res.json({ users });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateUserStatus = async (req, res) => {
    try {
        const { userId, status } = req.body;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }

        user.status = status;
        await user.save();
        res.json({ user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Gestion des chauffeurs
exports.getAllChauffeurs = async (req, res) => {
    try {
        const chauffeurs = await Chauffeur.find()
            .populate('user')
            .populate('vehicules');
        res.json({ chauffeurs });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateChauffeurStatus = async (req, res) => {
    try {
        const { chauffeurId, status } = req.body;
        const chauffeur = await Chauffeur.findById(chauffeurId);

        if (!chauffeur) {
            return res.status(404).json({ message: 'Chauffeur non trouvé' });
        }

        chauffeur.status = status;
        await chauffeur.save();
        res.json({ chauffeur });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Gestion des trajets
exports.getAllTrips = async (req, res) => {
    try {
        const trips = await Trip.find()
            .populate('userId')
            .populate('chauffeur');
        res.json({ trips });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
