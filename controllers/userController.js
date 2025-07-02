const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

exports.register = async (req, res) => {
  try {
    const { nom, email, motdepasse } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'Cet email est déjà utilisé.' });
    }
    const hash = await bcrypt.hash(motdepasse, 10);
    const user = new User({ nom, email, motdepasse: hash });
    await user.save();
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    res.status(201).json({
      message: 'Utilisateur créé',
      token,
      user: { id: user._id, nom: user.nom, email: user.email, role: user.role }
    });
  } catch (err) {
    res.status(400).json({ message: 'Erreur lors de l\'inscription', error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, motdepasse } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });
    const valid = await bcrypt.compare(motdepasse, user.motdepasse);
    if (!valid) return res.status(401).json({ message: 'Mot de passe incorrect' });

    // Vérification spéciale pour le super admin
    if (email === 'yvan' && motdepasse === 'yvan') {
      user.role = 'super_admin';
      await user.save();
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Connexion réussie',
      token,
      user: { id: user._id, nom: user.nom, email: user.email, role: user.role }
    });
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la connexion', error: err.message });
  }
};

exports.googleAuth = async (req, res) => {
  try {
    const { idToken } = req.body;
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { email, name } = payload;

    let user = await User.findOne({ email });
    if (!user) {
      user = new User({ nom: name, email, motdepasse: 'google-oauth' });
      await user.save();
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Connexion Google réussie',
      token,
      user: { id: user._id, nom: user.nom, email: user.email, role: user.role }
    });
  } catch (err) {
    res.status(401).json({ message: 'Erreur Google OAuth', error: err.message });
  }
};

exports.searchUsers = async (req, res) => {
  try {
    const { email } = req.query;
    const users = await User.find({ email: new RegExp(email, 'i') });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};