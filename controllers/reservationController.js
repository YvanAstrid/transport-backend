const Reservation = require('../models/Reservation');
const Ligne = require('../models/Ligne');
const calculePrix = require('../utils/calculePrix');

exports.create = async (req, res) => {
  try {
    const { transport, date, destination } = req.body;
    // Récupérer la ligne pour obtenir la distance
    const ligne = await Ligne.findById(transport);
    let prix = 100;
    if (ligne && ligne.distance) {
      prix = calculePrix(ligne.distance);
    }
    const reservation = new Reservation({
      utilisateur: req.user.id,
      transport,
      date,
      destination,
      prix
    });
    await reservation.save();
    res.status(201).json(reservation);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la création de la réservation', error: err.message });
  }
};

exports.listUser = async (req, res) => {
  try {
    const reservations = await Reservation.find({ utilisateur: req.user.id }).populate('transport');
    res.json(reservations);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la récupération', error: err.message });
  }
};