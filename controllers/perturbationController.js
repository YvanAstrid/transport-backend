const Perturbation = require('../models/Perturbation');

exports.getAllPerturbations = async (req, res) => {
  try {
    const perturbations = await Perturbation.find().populate('ligne');
    res.json(perturbations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getPerturbationById = async (req, res) => {
  try {
    const perturbation = await Perturbation.findById(req.params.id).populate('ligne');
    if (!perturbation) return res.status(404).json({ error: 'Perturbation non trouvée' });
    res.json(perturbation);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createPerturbation = async (req, res) => {
  try {
    const perturbation = new Perturbation(req.body);
    await perturbation.save();
    res.status(201).json(perturbation);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updatePerturbation = async (req, res) => {
  try {
    const perturbation = await Perturbation.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!perturbation) return res.status(404).json({ error: 'Perturbation non trouvée' });
    res.json(perturbation);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deletePerturbation = async (req, res) => {
  try {
    const perturbation = await Perturbation.findByIdAndDelete(req.params.id);
    if (!perturbation) return res.status(404).json({ error: 'Perturbation non trouvée' });
    res.json({ message: 'Perturbation supprimée' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; 