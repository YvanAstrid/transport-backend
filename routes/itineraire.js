const express = require('express');
const router = express.Router();
const itineraireController = require('../controllers/itineraireController');

// Exemple: /api/itineraire?departId=xxx&arriveeId=yyy
router.get('/', itineraireController.rechercherItineraire);

module.exports = router; 