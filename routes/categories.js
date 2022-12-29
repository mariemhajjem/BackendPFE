const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const ROLES_LIST = require('../config/roles_list');
const verifyRoles = require('../middleware/verifyRoles');

router.route('/').get(categoryController.getAllCategories) ;

router.post('/add',categoryController.createNewCategorie)
router.route('/update').put(categoryController.updateCategorie);
router.route('/:id')
    .delete(categoryController.deleteCategorie)
    .get(categoryController.getCategorie);

module.exports = router;