// Calcule le prix d'un trajet selon la distance (en km)
module.exports = function calculePrix(distanceKm) {
  if (!distanceKm || isNaN(distanceKm)) return 100;
  return Math.max(100, Math.ceil(distanceKm) * 100);
}; 