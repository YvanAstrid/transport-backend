const Lieu = require('../models/Lieu');
const Transport = require('../models/Transport');
const { validationResult } = require('express-validator');

// Créer un nouveau lieu
exports.createLieu = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { nom, adresse, latitude, longitude, type, notes } = req.body;
    const userId = req.user._id;

    const lieu = new Lieu({
      user: userId,
      nom,
      adresse,
      latitude,
      longitude,
      type,
      notes
    });

    await lieu.save();
    res.status(201).json({ lieu });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Récupérer tous les lieux de l'utilisateur
exports.getLieux = async (req, res) => {
  try {
    const userId = req.user._id;
    const lieux = await Lieu.find({ user: userId }).sort({ createdAt: -1 });
    res.json({ lieux });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Récupérer un lieu spécifique
exports.getLieu = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const lieu = await Lieu.findOne({ _id: id, user: userId });
    if (!lieu) {
      return res.status(404).json({ message: 'Lieu non trouvé' });
    }

    res.json({ lieu });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mettre à jour un lieu
exports.updateLieu = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const updates = req.body;

    const lieu = await Lieu.findOneAndUpdate(
      { _id: id, user: userId },
      updates,
      { new: true, runValidators: true }
    );

    if (!lieu) {
      return res.status(404).json({ message: 'Lieu non trouvé' });
    }

    res.json({ lieu });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Supprimer un lieu
exports.deleteLieu = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const lieu = await Lieu.findOneAndDelete({ _id: id, user: userId });
    if (!lieu) {
      return res.status(404).json({ message: 'Lieu non trouvé' });
    }

    res.json({ message: 'Lieu supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Marquer/démarquer comme favori
exports.toggleFavori = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const lieu = await Lieu.findOne({ _id: id, user: userId });
    if (!lieu) {
      return res.status(404).json({ message: 'Lieu non trouvé' });
    }

    lieu.favori = !lieu.favori;
    await lieu.save();

    res.json({ lieu });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Rechercher des transports vers un lieu
exports.rechercherTransports = async (req, res) => {
  try {
    const { latitude, longitude, rayon = 5000 } = req.query; // rayon en mètres

    if (!latitude || !longitude) {
      return res.status(400).json({ message: 'Latitude et longitude requises' });
    }

    // Recherche des transports dans un rayon donné
    const transports = await Transport.find({
      $and: [
        {
          latitude: {
            $gte: parseFloat(latitude) - (rayon / 111000), // approximation
            $lte: parseFloat(latitude) + (rayon / 111000)
          }
        },
        {
          longitude: {
            $gte: parseFloat(longitude) - (rayon / (111000 * Math.cos(parseFloat(latitude) * Math.PI / 180))),
            $lte: parseFloat(longitude) + (rayon / (111000 * Math.cos(parseFloat(latitude) * Math.PI / 180)))
          }
        }
      ]
    });

    // Calculer la distance pour chaque transport
    const transportsAvecDistance = transports.map(transport => {
      const distance = calculerDistance(
        parseFloat(latitude),
        parseFloat(longitude),
        transport.latitude,
        transport.longitude
      );
      return {
        ...transport.toObject(),
        distance: Math.round(distance)
      };
    });

    // Trier par distance
    transportsAvecDistance.sort((a, b) => a.distance - b.distance);

    res.json({ 
      transports: transportsAvecDistance,
      destination: { latitude, longitude }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Fonction utilitaire pour calculer la distance
function calculerDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Rayon de la Terre en km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c * 1000; // Distance en mètres
} 