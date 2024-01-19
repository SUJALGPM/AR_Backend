const doctorModel = require("../models/doctorModel");
const mrModel = require("../models/mrModel");

//Create Doctor controller....
const createDoctor = async (req, res) => {
    try {
        const mrID = req.params.id;

        const mrExist = await mrModel.findById(mrID);

        if (!mrExist) {
            return res.status(201).send({ message: "MR is not found..!", success: false });
        }

        const newDataMR = { mrReference: mrID, ...req.body };
        const doctor = new doctorModel(newDataMR);
        const createDoctor = await doctor.save();

        if (createDoctor) {
            return res.status(201).send({ message: "New Doctor is created successfully...", success: true });
        }

    } catch (err) {
        console.log(err);
        res.status(500).send({ message: "Doctor is not created...!", success: false });
    }
};

module.exports = { createDoctor };
