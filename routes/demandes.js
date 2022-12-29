const express = require('express');
const router = express.Router();
const demandeController = require('../controllers/demandeController'); 

router.route('/').get(demandeController.getAllDemandes) ;
router.route('/byuser').post(demandeController.getAllDemandesByUser) ; 
router.post('/add', demandeController.createNewDemande)

router.route('/:id').get(demandeController.getDemande);
router.route('/updatebyfournisseur').put(demandeController.updateDemandeByFournisseur); 
router.route('/updatebyclient').put(demandeController.updateDemandeByClient); 
module.exports = router;