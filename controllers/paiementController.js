const Paiement = require('../models/Paiement');

exports.create = async (req, res) => {
  try {
    const { reservation, montant } = req.body;
    const paiement = new Paiement({ reservation, montant });
    await paiement.save();
    res.status(201).json(paiement);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors du paiement', error: err.message });
  }
};