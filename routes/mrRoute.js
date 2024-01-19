const express = require('express');
const router = express.Router();
const { registerController, loginController } = require('../controllers/mrController');

//MR register controller....
router.post("/register/:id", registerController);

//MR login controller....
router.post("/login", loginController);

module.exports = router;