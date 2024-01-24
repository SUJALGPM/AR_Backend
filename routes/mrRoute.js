const express = require('express');
const router = express.Router();
const { registerController, loginController, getMrDoctor, getMRId, mrList } = require('../controllers/mrController');

//MR register controller....
router.post("/register/:id", registerController);

//MR login controller....
router.post("/login", loginController);

//Get All MR data...
router.get("/getMrDoctor", getMrDoctor);

//GET only the MR ID & name to create doctor....
router.get("/getMrDetail", getMRId);

//Get API for MR List TABLE...
router.get('/mrList', mrList);

module.exports = router;