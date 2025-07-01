const fetch = require('node-fetch');

const API_BASE = 'https://transport-backend-production.up.railway.app/api';

async function createArret(nom, lat, lng, description) {
  const res = await fetch(`${API_BASE}/arrets`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      nom,
      localisation: { latitude: lat, longitude: lng },
      description
    })
  });
  return res.json();
}

async function createLigne(nom, type, arrets, numero, compagnie, couleur) {
  const res = await fetch(`${API_BASE}/lignes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nom, type, arrets, numero, compagnie, couleur })
  });
  return res.json();
}

async function createHoraire(ligne, arret, heures) {
  const res = await fetch(`${API_BASE}/horaires`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ligne, arret, heures })
  });
  return res.json();
}

(async () => {
  // 1. Créer les arrêts principaux du Gabon
  const arretsData = [
    { nom: 'Libreville', lat: 0.3901, lng: 9.4544, description: 'Capitale' },
    { nom: 'Franceville', lat: -1.6333, lng: 13.5833, description: 'Ville du sud-est' },
    { nom: 'Port-Gentil', lat: -0.7193, lng: 8.7815, description: 'Ville portuaire' },
    { nom: 'Oyem', lat: 1.6000, lng: 11.5667, description: 'Ville du nord' },
    { nom: 'Lambaréné', lat: -0.7000, lng: 10.2333, description: 'Ville du centre' },
    { nom: 'Ndjolé', lat: -0.1833, lng: 10.7500, description: 'Gare SETRAG' },
    { nom: 'Moanda', lat: -1.5667, lng: 13.2000, description: 'Gare SETRAG' },
    { nom: 'Lastoursville', lat: -0.8167, lng: 12.7167, description: 'Gare SETRAG' },
    { nom: 'Makokou', lat: 0.5667, lng: 12.8667, description: 'Ville du nord-est' },
    { nom: 'Bitam', lat: 2.0833, lng: 11.5000, description: 'Ville du nord' },
    { nom: 'Lopé', lat: -0.385, lng: 11.522, description: 'Gare SETRAG' },
    { nom: 'Booué', lat: -0.092, lng: 11.938, description: 'Gare SETRAG' },
  ];
  const arrets = {};
  for (const a of arretsData) {
    const arret = await createArret(a.nom, a.lat, a.lng, a.description);
    arrets[a.nom] = arret;
    await new Promise(r => setTimeout(r, 300));
  }

  // 2. Créer les lignes Bus SOTRAGA
  const lignesData = [
    {
      nom: 'Libreville - Franceville',
      type: 'bus',
      arrets: [arrets['Libreville']._id, arrets['Ndjolé']._id, arrets['Lastoursville']._id, arrets['Moanda']._id, arrets['Franceville']._id],
      numero: 'SOTRAGA-1',
      compagnie: 'SOTRAGA',
      couleur: '#FF0000',
    },
    {
      nom: 'Libreville - Oyem',
      type: 'bus',
      arrets: [arrets['Libreville']._id, arrets['Lambaréné']._id, arrets['Bitam']._id, arrets['Oyem']._id],
      numero: 'SOTRAGA-2',
      compagnie: 'SOTRAGA',
      couleur: '#00FF00',
    },
    {
      nom: 'Libreville - Port-Gentil',
      type: 'bus',
      arrets: [arrets['Libreville']._id, arrets['Port-Gentil']._id],
      numero: 'SOTRAGA-3',
      compagnie: 'SOTRAGA',
      couleur: '#0000FF',
    },
    {
      nom: 'Owendo - Franceville',
      type: 'train',
      arrets: [arrets['Libreville']._id, arrets['Ndjolé']._id, arrets['Lopé']._id, arrets['Booué']._id, arrets['Lastoursville']._id, arrets['Moanda']._id, arrets['Franceville']._id],
      numero: 'SETRAG-1',
      compagnie: 'SETRAG',
      couleur: '#FFA500',
    },
    {
      nom: 'Libreville - Port-Gentil',
      type: 'avion',
      arrets: [arrets['Libreville']._id, arrets['Port-Gentil']._id],
      numero: 'AFRIJET-1',
      compagnie: 'Afrijet',
      couleur: '#800080',
    },
    {
      nom: 'Libreville - Franceville',
      type: 'avion',
      arrets: [arrets['Libreville']._id, arrets['Franceville']._id],
      numero: 'AFRIJET-2',
      compagnie: 'Afrijet',
      couleur: '#008080',
    },
    {
      nom: 'Libreville - Makokou',
      type: 'avion',
      arrets: [arrets['Libreville']._id, arrets['Makokou']._id],
      numero: 'AFRIJET-3',
      compagnie: 'Afrijet',
      couleur: '#FFD700',
    },
  ];

  const lignes = [];
  for (const l of lignesData) {
    const ligne = await createLigne(l.nom, l.type, l.arrets, l.numero, l.compagnie, l.couleur);
    lignes.push({ ...ligne, arrets: l.arrets }); // on garde le tableau d'IDs utilisé
    await new Promise(r => setTimeout(r, 300));
  }

  // 5. Créer des horaires pour chaque ligne (exemple pour le 1er arrêt de chaque ligne)
  for (const ligne of lignes) {
    const arret = ligne.arrets[0];
    const heures = ['06:00', '08:00', '10:00', '14:00', '18:00'];
    await createHoraire(ligne._id, arret, heures);
    await new Promise(r => setTimeout(r, 200));
  }

  console.log('Trajets Gabon (bus, train, avion) ajoutés avec succès !');
})(); 