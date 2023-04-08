const express = require('express');
const router = express.Router();
const reclamationController = require('../controllers/reclamationController'); 

router.route('/').get(reclamationController.getAllReclamations) ; 
router.post('/add', reclamationController.createReclamation)

router.route('/:id')
    .get(reclamationController.getReclamation)
    .delete(reclamationController.deleteReclamation);
module.exports = router;