const Arret = require('../models/Arret');

exports.getAllArrets = async (req, res) => {
  try {
    const arrets = await Arret.find();
    res.json(arrets);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getArretById = async (req, res) => {
  try {
    const arret = await Arret.findById(req.params.id);
    if (!arret) return res.status(404).json({ error: 'Arrêt non trouvé' });
    res.json(arret);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createArret = async (req, res) => {
  try {
    const arret = new Arret(req.body);
    await arret.save();
    res.status(201).json(arret);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateArret = async (req, res) => {
  try {
    const arret = await Arret.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!arret) return res.status(404).json({ error: 'Arrêt non trouvé' });
    res.json(arret);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteArret = async (req, res) => {
  try {
    const arret = await Arret.findByIdAndDelete(req.params.id);
    if (!arret) return res.status(404).json({ error: 'Arrêt non trouvé' });
    res.json({ message: 'Arrêt supprimé' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; 