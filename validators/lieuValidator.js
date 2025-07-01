const { body } = require('express-validator');

exports.validateLieu = [
  body('nom')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Le nom doit contenir entre 2 et 100 caractères'),
  
  body('adresse')
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('L\'adresse doit contenir entre 5 et 200 caractères'),
  
  body('latitude')
    .isFloat({ min: -90, max: 90 })
    .withMessage('La latitude doit être un nombre entre -90 et 90'),
  
  body('longitude')
    .isFloat({ min: -180, max: 180 })
    .withMessage('La longitude doit être un nombre entre -180 et 180'),
  
  body('type')
    .optional()
    .isIn(['maison', 'travail', 'ecole', 'commerce', 'autre'])
    .withMessage('Le type doit être l\'un des suivants: maison, travail, ecole, commerce, autre'),
  
  body('notes')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Les notes ne peuvent pas dépasser 500 caractères')
]; 