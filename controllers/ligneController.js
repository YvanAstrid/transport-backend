const Ligne = require('../models/Ligne');

exports.getAllLignes = async (req, res) => {
  try {
    const lignes = await Ligne.find().populate('arrets');
    // Adapter chaque ligne pour matcher le modèle Flutter
    const lignesAdapted = lignes.map(ligne => ({
      _id: ligne._id,
      type: ligne.type,
      description: ligne.nom,
      price: 1.5, // valeur par défaut
      startLocation: ligne.arrets[0]
        ? {
            latitude: ligne.arrets[0].localisation.latitude,
            longitude: ligne.arrets[0].localisation.longitude,
          }
        : null,
      endLocation: ligne.arrets[ligne.arrets.length - 1]
        ? {
            latitude: ligne.arrets[ligne.arrets.length - 1].localisation.latitude,
            longitude: ligne.arrets[ligne.arrets.length - 1].localisation.longitude,
          }
        : null,
      departureTime: null, // à remplir si tu as l'info
      arrivalTime: null,   // à remplir si tu as l'info
      vehicleType: ligne.type,
      company: 'Transport App',
      seatsAvailable: 50,
      status: 'En service',
      imageUrl: null,
      rating: 4.0,
      reviewCount: 0,
      distance: null,
    }));
    res.json(lignesAdapted);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getLigneById = async (req, res) => {
  try {
    const ligne = await Ligne.findById(req.params.id).populate('arrets');
    if (!ligne) return res.status(404).json({ error: 'Ligne non trouvée' });
    res.json(ligne);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createLigne = async (req, res) => {
  try {
    const ligne = new Ligne(req.body);
    await ligne.save();
    res.status(201).json(ligne);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateLigne = async (req, res) => {
  try {
    const ligne = await Ligne.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!ligne) return res.status(404).json({ error: 'Ligne non trouvée' });
    res.json(ligne);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteLigne = async (req, res) => {
  try {
    const ligne = await Ligne.findByIdAndDelete(req.params.id);
    if (!ligne) return res.status(404).json({ error: 'Ligne non trouvée' });
    res.json({ message: 'Ligne supprimée' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; 