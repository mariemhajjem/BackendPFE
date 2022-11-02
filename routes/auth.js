
const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/employeesController");

router.post("/login", AuthController.login);
router.post("/register", AuthController.createNewEmployee); 

module.exports = router;