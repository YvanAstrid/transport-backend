const express = require('express');
const router = express.Router();
const perturbationController = require('../controllers/perturbationController');

router.get('/', perturbationController.getAllPerturbations);
router.get('/:id', perturbationController.getPerturbationById);
router.post('/', perturbationController.createPerturbation);
router.put('/:id', perturbationController.updatePerturbation);
router.delete('/:id', perturbationController.deletePerturbation);

module.exports = router; 