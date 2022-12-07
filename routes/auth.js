
const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/authController");

router.post("/login", AuthController.login);
router.post("/register", AuthController.createNewUser); 
router.put("/profile", AuthController.updateProfile);
router.put("/resetPassword", AuthController.resetPassword); 

module.exports = router;