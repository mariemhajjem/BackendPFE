
const express = require("express");
const router = express.Router();

const AuthController = require("../controllers/authController");


router.post("/login", AuthController.login);
router.post("/register", AuthController.registerCenter);
router.post("/registerpharmacy", AuthController.registerPharmacy);


module.exports = router;