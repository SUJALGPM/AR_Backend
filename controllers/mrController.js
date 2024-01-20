const adminModel = require('../models/adminModel');
const doctorModel = require('../models/doctorModel');
const mrModel = require('../models/mrModel');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

//MR Login controller.....
const registerController = async (req, res) => {
    try {
        const adminIdRef = req.params.id;

        const adminExist = await adminModel.Admin.findById(adminIdRef);

        if (!adminExist) {
            return res.status(201).send({ message: "Admin not found..!", success: false });
        }

        const mrExist = await mrModel.MR.findOne({ MRId: req.body.MRId });
        if (mrExist) {
            return res.status(201).send({ message: "MR Already Exist...!", success: false });
        }

        // const password = req.body.password;
        // const salt = await bcrypt.genSalt(10);
        // const hashedPassword = await bcrypt.hash(password, salt);
        // req.body.password = hashedPassword;
        const newData = { adminId: adminIdRef, ...req.body };
        const MR = new mrModel.MR(newData);
        const createMR = await MR.save();

        if (createMR) {
            return res.status(201).send({ message: "MR register successfully...", success: true });
        }
    } catch (err) {
        console.log(err);
        res.status(500).send({ message: "MR failed to register...!", success: false });
    }
};

//MR Register controller...
const loginController = async (req, res) => {
    try {
        const user = await mrModel.MR.findOne({ MRId: req.body.MRId });

        if (!user) {
            return res.status(201).send({ message: "MR not found...!", success: false });
        }

        const password = req.body.password;
        if (password.length > 8) {
            return res.status(201).send({ message: "Password must be less then 8 character..!", success: false });
        }

        if (user.password !== password) {
            return res.status(201).send({ message: "Admin Credentials is incorrect...!", success: false });
        }

        res.status(201).send({ message: "MR login successfully...", success: true });
    } catch (err) {
        console.log(err);
        res.status(500).send({ message: "MR is failed to login...!", success: false });
    }
};

//Get All MR data...
const getMrDoctor = async (req, res) => {
    try {
        const mrData = await mrModel.MR.find({});

        if (mrData) {
            return res.status(201).send({ message: "All MR data fetch successfully...", success: true, data: mrData });
        }

    } catch (err) {
        console.log(err);
        res.status(500).send({ message: "Failed to fetch MR data...!", success: false });
    }
}

module.exports = { registerController, loginController, getMrDoctor };