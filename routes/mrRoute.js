const express = require('express');
const router = express.Router();
const { registerController, loginController, getMrDoctor } = require('../controllers/mrController');

//MR register controller....
router.post("/register/:id", registerController);

//MR login controller....
router.post("/login", loginController);

//Get All MR data...
router.get("/getMrDoctor", getMrDoctor);

module.exports = router;