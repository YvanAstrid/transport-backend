const express = require('express');
const router = express.Router();
const { authenticateToken, authorizeRoles } = require('../middlewares/auth');
const transportController = require('../controllers/transportController');
const transportValidator = require('../validators/transportValidator');

// Créer un transport (utilisateur connecté)
router.post('/', authenticateToken, transportValidator.validateTransport, transportController.create);

// Lister tous les transports (public)
router.get('/', transportController.list);

// Modifier un transport (admin)
router.put('/:id', authenticateToken, authorizeRoles('admin'), transportValidator.validateTransport, transportController.update);

// Supprimer un transport (admin)
router.delete('/:id', authenticateToken, authorizeRoles('admin'), transportController.delete);

module.exports = router;