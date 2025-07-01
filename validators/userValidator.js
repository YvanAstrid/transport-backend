// Exemple de squelette
exports.validateRegister = (req, res, next) => {
  const { nom, email, motdepasse } = req.body;
  if (!nom || typeof nom !== 'string' || nom.trim() === '') {
    return res.status(400).json({ message: 'Le nom est requis et doit être une chaîne non vide.' });
  }
  if (!email || typeof email !== 'string' || !email.includes('@')) {
    return res.status(400).json({ message: 'Un email valide est requis.' });
  }
  if (!motdepasse || typeof motdepasse !== 'string' || motdepasse.length < 6) {
    return res.status(400).json({ message: 'Le mot de passe est requis (6 caractères minimum).' });
  }
  next();
};

exports.validateLogin = (req, res, next) => {
  const { email, motdepasse } = req.body;
  if (!email || typeof email !== 'string' || !email.includes('@')) {
    return res.status(400).json({ message: 'Un email valide est requis.' });
  }
  if (!motdepasse || typeof motdepasse !== 'string' || motdepasse.length < 6) {
    return res.status(400).json({ message: 'Le mot de passe est requis (6 caractères minimum).' });
  }
  next();
};