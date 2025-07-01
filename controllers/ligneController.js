const Ligne = require('../models/Ligne');

exports.getAllLignes = async (req, res) => {
  try {
    const lignes = await Ligne.find().populate('arrets');
    res.json(lignes);
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