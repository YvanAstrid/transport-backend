const Transport = require('../models/Transport');

exports.create = async (req, res) => {
  try {
    const { nom, type, capacite } = req.body;
    const nouveauTransport = new Transport({ nom, type, capacite });
    await nouveauTransport.save();
    res.status(201).json(nouveauTransport);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la création du transport', error: err.message });
  }
};

exports.list = async (req, res) => {
  try {
    const transports = await Transport.find();
    res.json(transports);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la récupération des transports', error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { nom, type, capacite } = req.body;
    const transport = await Transport.findByIdAndUpdate(
      req.params.id,
      { nom, type, capacite },
      { new: true }
    );
    if (!transport) return res.status(404).json({ message: 'Transport non trouvé' });
    res.json(transport);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la modification du transport', error: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const transport = await Transport.findByIdAndDelete(req.params.id);
    if (!transport) return res.status(404).json({ message: 'Transport non trouvé' });
    res.json({ message: 'Transport supprimé' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la suppression du transport', error: err.message });
  }
};