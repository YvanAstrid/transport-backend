const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const http = require('http');
const { Server } = require('socket.io');
const session = require('express-session');
const sharedSession = require('express-socket.io-session');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const errorHandler = require('./middlewares/errorHandler');

const app = express();
const server = http.createServer(app);

// Middlewares de sécurité
app.use(helmet());
app.use(compression());
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true,
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: true
}));

// Middlewares globaux
app.use((req, res, next) => {
  res.on('finish', () => {
    console.log(`${req.method} ${req.originalUrl} => ${res.statusCode}`);
  });
  next();
});

// Connexion à MongoDB
const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/transport';
mongoose.connect(uri)
  .then(() => console.log('Connecté à MongoDB'))
  .catch((err) => console.error('Erreur de connexion à MongoDB:', err));

// Import des routes
const usersRoutes = require('./routes/users');
const transportsRoutes = require('./routes/transports');
const chauffeurRoutes = require('./routes/chauffeurRoutes');
const adminRoutes = require('./routes/adminRoutes');
const lieuxRoutes = require('./routes/lieux');
const logger = require('./middlewares/logger');
// Import des nouvelles routes
const lignesRoutes = require('./routes/lignes');
const arretsRoutes = require('./routes/arrets');
const horairesRoutes = require('./routes/horaires');
const perturbationsRoutes = require('./routes/perturbations');
const itineraireRoutes = require('./routes/itineraire');

// Utilisation des routes
app.use('/api/users', usersRoutes);
app.use('/api/transports', transportsRoutes);
app.use('/api/chauffeurs', chauffeurRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/lieux', lieuxRoutes);
app.use(logger);
// Utilisation des nouvelles routes
app.use('/api/lignes', lignesRoutes);
app.use('/api/arrets', arretsRoutes);
app.use('/api/horaires', horairesRoutes);
app.use('/api/perturbations', perturbationsRoutes);
app.use('/api/itineraire', itineraireRoutes);

// Route d'accueil
app.get('/', (req, res) => {
  res.send('API de transport opérationnelle !');
});

// Gestion centralisée des erreurs
app.use(errorHandler);

// Démarrage du serveur
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Serveur backend démarré sur le port ${PORT}`);
});