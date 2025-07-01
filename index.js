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
const MongoStore = require('connect-mongo');

const app = express();

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

// Configuration de session avec MongoDB
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI,
    ttl: 24 * 60 * 60, // 1 jour
  }),
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 1 jour
  }
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

// Gestion propre de l'arrêt du processus
process.on('SIGTERM', () => {
  console.log('SIGTERM reçu, arrêt propre du serveur...');
  server.close(() => {
    console.log('Serveur arrêté proprement');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT reçu, arrêt propre du serveur...');
  server.close(() => {
    console.log('Serveur arrêté proprement');
    process.exit(0);
  });
});

// Gestion des erreurs non capturées
process.on('uncaughtException', (err) => {
  console.error('Erreur non capturée:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Promesse rejetée non gérée:', reason);
  process.exit(1);
});

const server = app.listen(PORT, () => {
  console.log(`Serveur backend démarré sur le port ${PORT}`);
  console.log(`Environnement: ${process.env.NODE_ENV || 'development'}`);
  console.log(`MongoDB URI configuré: ${process.env.MONGODB_URI ? 'Oui' : 'Non'}`);
});

// Configuration Socket.IO si nécessaire
// const io = new Server(server, {
//   cors: {
//     origin: process.env.CORS_ORIGIN || '*',
//     credentials: true
//   }
// });