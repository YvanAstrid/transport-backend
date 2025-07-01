const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middlewares/auth');
const reservationController = require('../controllers/reservationController');
const reservationValidator = require('../validators/reservationValidator');

// Créer une réservation
router.post(
  '/',
  authenticateToken,
  reservationValidator.validateReservation,
  reservationController.create
);

// Lister les réservations de l'utilisateur connecté
router.get('/mes', authenticateToken, reservationController.listUser);

// Mettre à jour la position actuelle d'une réservation
router.put(
  '/:id/position',
  authenticateToken,
  async (req, res) => {
    try {
      const { lat, lng } = req.body;
      if (typeof lat !== 'number' || typeof lng !== 'number') {
        return res.status(400).json({ message: 'Latitude et longitude requises.' });
      }
      const reservation = await Reservation.findByIdAndUpdate(
        req.params.id,
        { positionActuelle: { lat, lng } },
        { new: true }
      );
      if (!reservation) return res.status(404).json({ message: 'Réservation non trouvée' });
      res.json(reservation);
    } catch (err) {
      res.status(500).json({ message: 'Erreur lors de la mise à jour de la position', error: err.message });
    }
  }
);

// Récupérer la position actuelle d'une réservation
router.get(
  '/:id/position',
  authenticateToken,
  async (req, res) => {
    try {
      const reservation = await Reservation.findById(req.params.id);
      if (!reservation) return res.status(404).json({ message: 'Réservation non trouvée' });
      res.json(reservation.positionActuelle);
    } catch (err) {
      res.status(500).json({ message: 'Erreur lors de la récupération de la position', error: err.message });
    }
  }
);

module.exports = router;