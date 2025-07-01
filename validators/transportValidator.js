// Exemple de squelette
exports.validateTransport = (req, res, next) => {
  const { nom, type, capacite } = req.body;
  if (!nom || typeof nom !== 'string' || nom.trim() === '') {
    return res.status(400).json({ message: 'Le nom est requis et doit être une chaîne non vide.' });
  }
  if (!type || typeof type !== 'string' || type.trim() === '') {
    return res.status(400).json({ message: 'Le type est requis et doit être une chaîne non vide.' });
  }
  if (!capacite || typeof capacite !== 'number' || capacite <= 0) {
    return res.status(400).json({ message: 'La capacité est requise et doit être un nombre positif.' });
  }
  next();
};