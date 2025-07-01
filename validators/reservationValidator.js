// Exemple de squelette
exports.validateReservation = (req, res, next) => {
  const { transport, date, destination } = req.body;
  if (!transport) return res.status(400).json({ message: 'Le transport est requis.' });
  if (!date) return res.status(400).json({ message: 'La date est requise.' });
  if (!destination || typeof destination !== 'string' || destination.trim() === '') {
    return res.status(400).json({ message: 'La destination est requise.' });
  }
  next();
};