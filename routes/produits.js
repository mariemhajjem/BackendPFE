const express = require('express');
const router = express.Router();
const productsController = require('../controllers/productsController');
const ROLES_LIST = require('../config/roles_list');
const verifyRoles = require('../middleware/verifyRoles');
const upload = require('../middleware/upload');

router.route('/')
    .post(upload.array('product_picture'), productsController.createNewProduit)
    .get(productsController.getAllProduits) 
    .put(verifyRoles(ROLES_LIST.ADMIN, ROLES_LIST.EMPLOYEE), productsController.updateProduit);
    

router.route('/:id')
    .delete(verifyRoles(ROLES_LIST.ADMIN), productsController.deleteProduit)
    .get(productsController.getProduit);

module.exports = router;