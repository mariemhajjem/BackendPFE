const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');
const ROLES_LIST = require('../config/roles_list');
const verifyRoles = require('../middleware/verifyRoles');

router.route('/')
    .get(usersController.getAllUsers)
    //.put(verifyRoles(ROLES_LIST.ADMIN), usersController)
    .delete(verifyRoles(ROLES_LIST.ADMIN), usersController.deleteUser);

router.route('/:id')
    .get(verifyRoles(ROLES_LIST.ADMIN), usersController.getUser);

module.exports = router;