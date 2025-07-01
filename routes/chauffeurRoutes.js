const express = require('express');
const router = express.Router();
const { createChauffeur, getChauffeurProfile, updateChauffeurProfile, getAvailableChauffeurs } = require('../controllers/chauffeurController');
const { authenticateToken } = require('../middlewares/auth');

// Créer un nouveau chauffeur
router.post('/', authenticateToken, createChauffeur);

// Récupérer le profil du chauffeur
router.get('/profile', authenticateToken, getChauffeurProfile);

// Mettre à jour le profil du chauffeur
router.put('/profile', authenticateToken, updateChauffeurProfile);

// Obtenir la liste des chauffeurs disponibles
router.get('/available', getAvailableChauffeurs);

module.exports = router;
