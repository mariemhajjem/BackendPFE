const express = require('express');
const router = express.Router();
const productsController = require('../controllers/productsController');
const ROLES_LIST = require('../config/roles_list');
const verifyRoles = require('../middleware/verifyRoles');
const upload = require('../middleware/upload');
/* const multer  = require('multer')
const upload = multer({ dest: 'uploads/' }) */

router.route('/').get(productsController.getAllProduits) ;
router.route('/byuser').post(productsController.getAllProduitsByUser) ;
router.route('/update').put(productsController.updateProduit);
router.post('/add',upload.single('product_picture'), productsController.createNewProduit)

router.route('/:id')
    .delete(productsController.deleteProduit)
    .get(productsController.getProduit);
//  .delete(verifyRoles(ROLES_LIST.ADMIN), productsController.deleteProduit)
module.exports = router;