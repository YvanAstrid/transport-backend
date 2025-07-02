const express = require('express');
const router = express.Router();
const arretController = require('../controllers/arretController');

router.get('/', arretController.getAllArrets);
router.get('/:id', arretController.getArretById);
router.post('/', arretController.createArret);
router.put('/:id', arretController.updateArret);
router.delete('/:id', arretController.deleteArret);
router.get('/search', arretController.searchArrets);

module.exports = router; 