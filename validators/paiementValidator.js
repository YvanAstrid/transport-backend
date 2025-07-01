// Exemple de squelette
exports.validatePaiement = (req, res, next) => {
  const { reservation, montant } = req.body;
  if (!reservation) {
    return res.status(400).json({ message: 'La réservation est requise.' });
  }
  if (!montant || typeof montant !== 'number' || montant <= 0) {
    return res.status(400).json({ message: 'Le montant est requis et doit être un nombre positif.' });
  }
  next();
};