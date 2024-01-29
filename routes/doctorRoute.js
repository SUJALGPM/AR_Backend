const express = require('express');
const router = express.Router();
const { createDoctor, getAllDoctors, doctorUsageController, doctorStaticUsage, listStaticUsage } = require('../controllers/doctorController');

//Create doctor controller by MR...
router.post("/createDoctor", createDoctor);

//Get all doctor created by MR....
router.get("/getAllDoctors", getAllDoctors);

//Post api doctor usage of category & filters...
router.post("/doctorUsage", doctorUsageController);

//Post APIs for static doctor Usage...
router.post("/staticUsage", doctorStaticUsage);

//Get APIs for static Dr Table List....
router.get("/listStaticUsage", listStaticUsage);

module.exports = router;