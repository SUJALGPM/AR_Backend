const mrModel = require("../models/mrModel");

//Create Doctor controller....
const createDoctor = async (req, res) => {
    try {
        const mrID = req.params.id;

        const mrExist = await mrModel.MR.findById(mrID).populate('doctorList');

        if (!mrExist) {
            return res.status(201).send({ message: "MR is not found..!", success: false });
        }

        const newDataMR = { mrReference: mrID, ...req.body };
        const doctor = new mrModel.DoctorModel(newDataMR);
        const createDoctor = await doctor.save();

        mrExist.doctorList.push(createDoctor);
        await mrExist.save();

        return res.status(201).send({ message: "New Doctor is created successfully...", success: true });

    } catch (err) {
        console.log(err);
        res.status(500).send({ message: "Doctor is not created...!", success: false });
    }
};

//Get all doctor created by MR....
const getAllDoctors = (req, res) => {
    try {

    } catch (err) {
        console.log(err);
    }
}

module.exports = { createDoctor, getAllDoctors };
