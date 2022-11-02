const express = require('express');
const router = express.Router();
const entrepriseController = require('../controllers/entrepriseController');
const ROLES_LIST = require('../config/roles_list');
const verifyRoles = require('../middleware/verifyRoles');

router.route('/')
    .get(entrepriseController.getAllEntreprises) 
    .put(verifyRoles(ROLES_LIST.ADMIN, ROLES_LIST.EMPLOYEE), entrepriseController.updateEntreprise)
    .delete(verifyRoles(ROLES_LIST.ADMIN), entrepriseController.deleteEntreprise);

router.route('/:id')
    .get(entrepriseController.getEntreprise);

module.exports = router;