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

async function createLigne(nom, type, arrets, numero, couleur) {
  const res = await fetch(`${API_BASE}/lignes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nom, type, arrets, numero, couleur })
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

async function createPerturbation(ligne, description, dateDebut, dateFin) {
  const res = await fetch(`${API_BASE}/perturbations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ligne, description, dateDebut, dateFin })
  });
  return res.json();
}

function randomCoord(base, delta) {
  return base + (Math.random() - 0.5) * delta;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

(async () => {
  // 1. Créer 20 arrêts
  const arrets = [];
  for (let i = 0; i < 20; i++) {
    const nom = `Arrêt ${String.fromCharCode(65 + i)}`;
    const lat = randomCoord(48.8566, 0.05);
    const lng = randomCoord(2.3522, 0.05);
    const description = `Arrêt numéro ${i + 1}`;
    const arret = await createArret(nom, lat, lng, description);
    arrets.push(arret);
    await sleep(500); // Ajoute 0,5 seconde entre chaque POST
  }

  // 2. Créer 20 lignes (chaque ligne relie 3 à 5 arrêts)
  const lignes = [];
  const types = ['bus', 'tram', 'metro', 'train', 'autre'];
  for (let i = 0; i < 20; i++) {
    const nbArrets = 3 + Math.floor(Math.random() * 3); // 3 à 5 arrêts
    const arretsLigne = [];
    let start = Math.floor(Math.random() * (arrets.length - nbArrets));
    for (let j = 0; j < nbArrets; j++) {
      arretsLigne.push(arrets[(start + j) % arrets.length]._id);
    }
    const nom = `Ligne ${i + 1}`;
    const type = types[i % types.length];
    const numero = `${i + 1}`;
    const couleur = `#${Math.floor(Math.random()*16777215).toString(16).padStart(6, '0')}`;
    const ligne = await createLigne(nom, type, arretsLigne, numero, couleur);
    lignes.push(ligne);
    await sleep(500); // Ajoute 0,5 seconde entre chaque POST
  }

  // 3. Créer 20 horaires (1 par ligne, pour le 1er arrêt de chaque ligne)
  const horaires = [];
  for (let i = 0; i < 20; i++) {
    const ligne = lignes[i];
    const arret = ligne.arrets[0];
    const heures = [];
    for (let h = 6; h < 24; h += 2) {
      heures.push(`${h.toString().padStart(2, '0')}:00`);
    }
    const horaire = await createHoraire(ligne._id, arret, heures);
    horaires.push(horaire);
    await sleep(500); // Ajoute 0,5 seconde entre chaque POST
  }

  // 4. Créer 20 perturbations (1 par ligne)
  for (let i = 0; i < 20; i++) {
    const ligne = lignes[i];
    const description = `Perturbation sur la ${ligne.nom}`;
    const dateDebut = `2024-06-${(i+1).toString().padStart(2, '0')}T08:00:00Z`;
    const dateFin = `2024-06-${(i+2).toString().padStart(2, '0')}T18:00:00Z`;
    await createPerturbation(ligne._id, description, dateDebut, dateFin);
    await sleep(500); // Ajoute 0,5 seconde entre chaque POST
  }

  console.log('20 arrêts, 20 lignes, 20 horaires, 20 perturbations créés !');
})(); 