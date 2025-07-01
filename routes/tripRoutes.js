const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middlewares/auth');
const { createTrip, updateLocation, endTrip } = require('../controllers/tripController');

// Créer un nouveau trajet
router.post('/trips', authenticateToken, createTrip);

// Mettre à jour la position en temps réel
router.put('/trips/:tripId/location', authenticateToken, updateLocation);

// Terminer un trajet
router.put('/trips/:tripId/end', authenticateToken, endTrip);

module.exports = router;
