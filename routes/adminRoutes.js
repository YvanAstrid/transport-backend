const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middlewares/auth');
const { createAdmin, getAdminProfile, updateAdminProfile, getAllUsers, updateUserStatus, getAllChauffeurs, updateChauffeurStatus, getAllTrips, isAdmin } = require('../controllers/adminController');

// Créer un nouvel administrateur
router.post('/', authenticateToken, createAdmin);

// Récupérer le profil de l'administrateur
router.get('/profile', authenticateToken, getAdminProfile);

// Mettre à jour le profil de l'administrateur
router.put('/profile', authenticateToken, updateAdminProfile);

// Gestion des utilisateurs
router.get('/users', authenticateToken, isAdmin, getAllUsers);
router.put('/users/:userId/status', authenticateToken, isAdmin, updateUserStatus);

// Gestion des chauffeurs
router.get('/chauffeurs', authenticateToken, isAdmin, getAllChauffeurs);
router.put('/chauffeurs/:chauffeurId/status', authenticateToken, isAdmin, updateChauffeurStatus);

// Gestion des trajets
router.get('/trips', authenticateToken, isAdmin, getAllTrips);

module.exports = router;
