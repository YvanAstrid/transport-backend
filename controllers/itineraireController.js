const Ligne = require('../models/Ligne');
const Arret = require('../models/Arret');

// Recherche d'itinéraire direct entre deux arrêts
exports.rechercherItineraire = async (req, res) => {
  const { departId, arriveeId } = req.query;
  if (!departId || !arriveeId) {
    return res.status(400).json({ error: 'Les identifiants des arrêts de départ et d\'arrivée sont requis.' });
  }
  try {
    // Chercher les lignes qui contiennent les deux arrêts
    const lignes = await Ligne.find({
      arrets: { $all: [departId, arriveeId] }
    }).populate('arrets');
    res.json(lignes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; 