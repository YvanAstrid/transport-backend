const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middlewares/auth');
const lieuController = require('../controllers/lieuController');
const lieuValidator = require('../validators/lieuValidator');

// Créer un nouveau lieu
router.post('/', authenticateToken, lieuValidator.validateLieu, lieuController.createLieu);

// Récupérer tous les lieux de l'utilisateur
router.get('/', authenticateToken, lieuController.getLieux);

// Récupérer un lieu spécifique
router.get('/:id', authenticateToken, lieuController.getLieu);

// Mettre à jour un lieu
router.put('/:id', authenticateToken, lieuValidator.validateLieu, lieuController.updateLieu);

// Supprimer un lieu
router.delete('/:id', authenticateToken, lieuController.deleteLieu);

// Marquer/démarquer comme favori
router.patch('/:id/favori', authenticateToken, lieuController.toggleFavori);

// Rechercher des transports vers un lieu (route publique)
router.get('/recherche/transports', lieuController.rechercherTransports);

module.exports = router; 