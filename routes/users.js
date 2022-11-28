const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');
const ROLES_LIST = require('../config/roles_list');
const verifyRoles = require('../middleware/verifyRoles');

router.route('/')
    .get(usersController.getAllUsers) 
    .put(verifyRoles(ROLES_LIST.ADMIN), usersController.updateUser)
    .delete(verifyRoles(ROLES_LIST.ADMIN), usersController.deleteUser);
router.route('/:id').put(usersController.getUser);
router.route('/block/:id').put(usersController.blockUser);
router.route('/:id').get(usersController.getUser);

module.exports = router;