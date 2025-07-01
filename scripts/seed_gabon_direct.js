const mongoose = require('mongoose');
const Lieu = require('../models/Arret');
const Ligne = require('../models/Ligne');
const Horaire = require('../models/Horaire');
const Perturbation = require('../models/Perturbation');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/transport';

async function main() {
  await mongoose.connect(MONGO_URI);

  // 1. Arrêts
  const arretsData = [
    { nom: 'Libreville', localisation: { latitude: 0.3901, longitude: 9.4544 }, description: 'Capitale' },
    { nom: 'Franceville', localisation: { latitude: -1.6333, longitude: 13.5833 }, description: 'Ville du sud-est' },
    { nom: 'Port-Gentil', localisation: { latitude: -0.7193, longitude: 8.7815 }, description: 'Ville portuaire' },
    { nom: 'Oyem', localisation: { latitude: 1.6000, longitude: 11.5667 }, description: 'Ville du nord' },
    { nom: 'Lambaréné', localisation: { latitude: -0.7000, longitude: 10.2333 }, description: 'Ville du centre' },
    { nom: 'Ndjolé', localisation: { latitude: -0.1833, longitude: 10.7500 }, description: 'Gare SETRAG' },
    { nom: 'Moanda', localisation: { latitude: -1.5667, longitude: 13.2000 }, description: 'Gare SETRAG' },
    { nom: 'Lastoursville', localisation: { latitude: -0.8167, longitude: 12.7167 }, description: 'Gare SETRAG' },
    { nom: 'Makokou', localisation: { latitude: 0.5667, longitude: 12.8667 }, description: 'Ville du nord-est' },
    { nom: 'Bitam', localisation: { latitude: 2.0833, longitude: 11.5000 }, description: 'Ville du nord' },
    { nom: 'Lopé', localisation: { latitude: -0.385, longitude: 11.522 }, description: 'Gare SETRAG' },
    { nom: 'Booué', localisation: { latitude: -0.092, longitude: 11.938 }, description: 'Gare SETRAG' },
  ];
  await Lieu.deleteMany({});
  const arrets = await Lieu.insertMany(arretsData);

  // 2. Lignes
  const getId = nom => arrets.find(a => a.nom === nom)._id;
  const lignesData = [
    {
      nom: 'Libreville - Franceville',
      type: 'bus',
      arrets: [getId('Libreville'), getId('Ndjolé'), getId('Lastoursville'), getId('Moanda'), getId('Franceville')],
      numero: 'SOTRAGA-1',
      couleur: '#FF0000'
    },
    {
      nom: 'Libreville - Oyem',
      type: 'bus',
      arrets: [getId('Libreville'), getId('Lambaréné'), getId('Bitam'), getId('Oyem')],
      numero: 'SOTRAGA-2',
      couleur: '#00FF00'
    },
    {
      nom: 'Libreville - Port-Gentil',
      type: 'bus',
      arrets: [getId('Libreville'), getId('Port-Gentil')],
      numero: 'SOTRAGA-3',
      couleur: '#0000FF'
    },
    {
      nom: 'Owendo - Franceville',
      type: 'train',
      arrets: [getId('Libreville'), getId('Ndjolé'), getId('Lopé'), getId('Booué'), getId('Lastoursville'), getId('Moanda'), getId('Franceville')],
      numero: 'SETRAG-1',
      couleur: '#FFA500'
    },
    {
      nom: 'Libreville - Port-Gentil',
      type: 'avion',
      arrets: [getId('Libreville'), getId('Port-Gentil')],
      numero: 'AFRIJET-1',
      couleur: '#800080'
    },
    {
      nom: 'Libreville - Franceville',
      type: 'avion',
      arrets: [getId('Libreville'), getId('Franceville')],
      numero: 'AFRIJET-2',
      couleur: '#008080'
    },
    {
      nom: 'Libreville - Makokou',
      type: 'avion',
      arrets: [getId('Libreville'), getId('Makokou')],
      numero: 'AFRIJET-3',
      couleur: '#FFD700'
    },
  ];
  await Ligne.deleteMany({});
  const lignes = await Ligne.insertMany(lignesData);

  // 3. Horaires
  await Horaire.deleteMany({});
  for (const ligne of lignes) {
    const arret = ligne.arrets[0];
    const heures = ['06:00', '08:00', '10:00', '14:00', '18:00'];
    await Horaire.create({ ligne: ligne._id, arret, heures });
  }

  // 4. Perturbations
  await Perturbation.deleteMany({});
  for (const ligne of lignes) {
    await Perturbation.create({
      ligne: ligne._id,
      description: `Perturbation sur la ${ligne.nom}`,
      dateDebut: new Date(),
      dateFin: null
    });
  }

  console.log('Base locale remplie avec les trajets Gabon !');
  process.exit();
}

main(); 