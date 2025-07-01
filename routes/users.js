const express = require('express');
const router = express.Router();
const { authenticateToken, authorizeRoles } = require('../middlewares/auth');
const userController = require('../controllers/userController');
const userValidator = require('../validators/userValidator');

// Inscription utilisateur
router.post('/register', userValidator.validateRegister, userController.register);

// Connexion utilisateur
router.post('/login', userValidator.validateLogin, userController.login);

// Lister tous les utilisateurs (admin seulement)
router.get('/', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  // Optionnel : à déplacer dans un contrôleur si besoin
  const User = require('../models/User');
  try {
    const users = await User.find().select('-motdepasse');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la récupération des utilisateurs', error: err.message });
  }
});

module.exports = router;