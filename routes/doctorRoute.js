const express = require('express');
const router = express.Router();
const { createDoctor, getAllDoctors, doctorUsageController } = require('../controllers/doctorController');

//Create doctor controller by MR...
router.post("/createDoctor", createDoctor);

//Get all doctor created by MR....
router.get("/getAllDoctors", getAllDoctors);

//Post api doctor usage of category & filters...
router.post("/doctorUsage", doctorUsageController);

module.exports = router;