const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middlewares/auth');
const paiementController = require('../controllers/paiementController');
const paiementValidator = require('../validators/paiementValidator');

// Créer un paiement
router.post('/', authenticateToken, paiementValidator.validatePaiement, paiementController.create);

module.exports = router;