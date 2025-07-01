// Script d'injection de données Gabon : arrêts, lignes, distances, tarification
const mongoose = require('mongoose');
const Arret = require('../models/Arret');
const Ligne = require('../models/Ligne');
require('dotenv').config({ path: '../../.env' });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/transport';

// Principales villes/quartiers du Gabon (exemple, à compléter selon besoin)
const arretsData = [
  { nom: 'Libreville', localisation: { latitude: 0.3901, longitude: 9.4544 } },
  { nom: 'Akanda', localisation: { latitude: 0.5222, longitude: 9.3762 } },
  { nom: 'Owendo', localisation: { latitude: 0.2781, longitude: 9.5144 } },
  { nom: 'Nzeng-Ayong', localisation: { latitude: 0.4167, longitude: 9.4667 } },
  { nom: 'Port-Gentil', localisation: { latitude: -0.7193, longitude: 8.7815 } },
  { nom: 'Franceville', localisation: { latitude: -1.6333, longitude: 13.5833 } },
  { nom: 'Oyem', localisation: { latitude: 1.6000, longitude: 11.5667 } },
  { nom: 'Bitam', localisation: { latitude: 2.0833, longitude: 11.5000 } },
  { nom: 'Lambaréné', localisation: { latitude: -0.7000, longitude: 10.2333 } },
  { nom: 'Moanda', localisation: { latitude: -1.5667, longitude: 13.2000 } },
  { nom: 'Makokou', localisation: { latitude: 0.5667, longitude: 12.8667 } },
  { nom: 'Tchibanga', localisation: { latitude: -2.8500, longitude: 11.0333 } },
  { nom: 'Mouila', localisation: { latitude: -1.8667, longitude: 11.0500 } },
  { nom: 'Koulamoutou', localisation: { latitude: -1.1333, longitude: 12.4667 } },
  { nom: 'Ndjolé', localisation: { latitude: -0.1833, longitude: 10.7500 } },
  { nom: 'Ntoum', localisation: { latitude: 0.3833, longitude: 9.7667 } },
  { nom: 'Owendo Gare', localisation: { latitude: 0.2833, longitude: 9.5000 } },
  { nom: 'Alibandeng', localisation: { latitude: 0.4167, longitude: 9.4833 } },
  { nom: 'Glass', localisation: { latitude: 0.3833, longitude: 9.4500 } },
  { nom: 'PK5', localisation: { latitude: 0.4000, longitude: 9.4500 } },
];

// Haversine pour calculer la distance en km
function haversine(lat1, lon1, lat2, lon2) {
  const R = 6371; // Rayon de la Terre en km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Tarification : 100 FCFA/km, minimum 100 FCFA
function calculTarif(distanceKm) {
  return Math.max(100, Math.round(distanceKm) * 100);
}

async function seed() {
  await mongoose.connect(MONGODB_URI);
  console.log('Connecté à MongoDB');

  // Nettoyer les anciennes données (optionnel)
  await Arret.deleteMany({});
  await Ligne.deleteMany({});

  // Créer les arrêts
  const arrets = await Arret.insertMany(arretsData);
  console.log('Arrêts créés:', arrets.length);

  // Créer des lignes entre chaque paire d'arrêts (exemple : toutes les combinaisons)
  let lignes = [];
  for (let i = 0; i < arrets.length; i++) {
    for (let j = i + 1; j < arrets.length; j++) {
      const depart = arrets[i];
      const arrivee = arrets[j];
      const distance = haversine(
        depart.localisation.latitude,
        depart.localisation.longitude,
        arrivee.localisation.latitude,
        arrivee.localisation.longitude
      );
      const tarif = calculTarif(distance);
      const ligne = {
        nom: `${depart.nom} - ${arrivee.nom}`,
        arrets: [depart._id, arrivee._id],
        distance: distance,
        tarif: tarif,
        type: 'bus', // ou 'train', 'avion' selon la logique
      };
      lignes.push(ligne);
    }
  }
  await Ligne.insertMany(lignes);
  console.log('Lignes créées:', lignes.length);

  mongoose.disconnect();
  console.log('Fin du script.');
}

seed().catch(err => {
  console.error('Erreur lors du seed:', err);
  mongoose.disconnect();
}); 