const Horaire = require('../models/Horaire');

exports.getAllHoraires = async (req, res) => {
  try {
    const horaires = await Horaire.find().populate('ligne arret');
    res.json(horaires);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getHoraireById = async (req, res) => {
  try {
    const horaire = await Horaire.findById(req.params.id).populate('ligne arret');
    if (!horaire) return res.status(404).json({ error: 'Horaire non trouvé' });
    res.json(horaire);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createHoraire = async (req, res) => {
  try {
    const horaire = new Horaire(req.body);
    await horaire.save();
    res.status(201).json(horaire);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateHoraire = async (req, res) => {
  try {
    const horaire = await Horaire.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!horaire) return res.status(404).json({ error: 'Horaire non trouvé' });
    res.json(horaire);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteHoraire = async (req, res) => {
  try {
    const horaire = await Horaire.findByIdAndDelete(req.params.id);
    if (!horaire) return res.status(404).json({ error: 'Horaire non trouvé' });
    res.json({ message: 'Horaire supprimé' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; 