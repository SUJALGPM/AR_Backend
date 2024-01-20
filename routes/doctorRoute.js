const express = require('express');
const router = express.Router();
const { createDoctor, getAllDoctors } = require('../controllers/doctorController');

//Create doctor controller by MR...
router.post("/createDoctor/:id", createDoctor);

//Get all doctor created by MR....
router.get("/getAllDoctors", getAllDoctors);

module.exports = router;