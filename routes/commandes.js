const express = require('express');
const router = express.Router();
const commandeController = require('../controllers/commandeController'); 

router.route('/').get(commandeController.getAllCommandes) ;
router.route('/byuser').post(commandeController.getAllCommandesByUser) ; 
router.post('/add', commandeController.createNewCommande)

router.route('/:id').get(commandeController.getCommande);
router.route('/update').put(commandeController.updateCommande); 
module.exports = router;