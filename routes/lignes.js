const express = require('express');
const router = express.Router();
const ligneController = require('../controllers/ligneController');

router.get('/', ligneController.getAllLignes);
router.get('/:id', ligneController.getLigneById);
router.post('/', ligneController.createLigne);
router.put('/:id', ligneController.updateLigne);
router.delete('/:id', ligneController.deleteLigne);

module.exports = router; 