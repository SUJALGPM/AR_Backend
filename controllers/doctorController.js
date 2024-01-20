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

//Post api doctor usage of category & filters...
const doctorUsageController = async (req, res) => {
    try {
        const doctorID = req.params.id;
        const { categoryName, filterName } = req.body;

        const doctorExist = await mrModel.DoctorModel.findById(doctorID).populate('categories');
        if (!doctorExist) {
            return res.status(404).send({ message: "Doctors is not found..!", success: false });
        }

        if (!categoryName) {
            return res.status(201).send({ message: "Category Name is not found..!", success: false });
        } else if (!filterName) {
            return res.status(201).send({ message: "Filters Name is not found..!", success: false });
        }

        //Store the usage in UsageModel...
        const newUsage = new mrModel.doctorUsage(req.body);
        const newUsageEntry = await newUsage.save();

        //Push to the doctor model...
        doctorExist.categories.push(newUsageEntry);
        const pushDone = await doctorExist.save();

        if (pushDone) {
            return res.status(201).send({ message: "Usage Data successfully push to doctor model...", success: true });
        }
    } catch (err) {
        console.log(err);
        res.status(501).send({ message: "Failed to logged the Usage data...", success: false });
    }
}

module.exports = { createDoctor, getAllDoctors, doctorUsageController };
