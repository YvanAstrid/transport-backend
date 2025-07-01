const express = require('express');
const router = express.Router();
const horaireController = require('../controllers/horaireController');

router.get('/', horaireController.getAllHoraires);
router.get('/:id', horaireController.getHoraireById);
router.post('/', horaireController.createHoraire);
router.put('/:id', horaireController.updateHoraire);
router.delete('/:id', horaireController.deleteHoraire);

module.exports = router; 