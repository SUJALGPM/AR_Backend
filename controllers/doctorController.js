const mrModel = require("../models/mrModel");

//Create Doctor controller....
const createDoctor = async (req, res) => {
    try {
        // const mrID = req.params.id;
        const mrID = req.body.mrId;

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

//Post api doctor usage of category & filters...
const doctorUsageController = async (req, res) => {
    try {

        //const doctorID = req.params.id;
        const doctorID = req.body.doctorID;

        const { categoryName, filterName } = req.body;

        const doctorExist = await mrModel.DoctorModel.findById(doctorID).populate({
            path: 'categories',
            populate: {
                path: 'doctorList',
                model: 'MRUser'
            }
        });

        if (!doctorExist) {
            return res.status(404).send({ message: "Doctors is not found..!", success: false });
        }

        if (!categoryName) {
            return res.status(404).send({ message: "Category Name is not found..!", success: false });
        } else if (!filterName) {
            return res.status(404).send({ message: "Filters Name is not found..!", success: false });
        }

        //Store the usage in UsageModel...
        const newUsage = new mrModel.doctorUsage(req.body);
        const newUsageEntry = await newUsage.save();

        //Push to the doctor model...
        doctorExist.categories.push(newUsageEntry);
        await doctorExist.save();

        // Push the newUsageEntry to the doctorList field in MR schema
        const mrUser = await mrModel.MR.findOneAndUpdate(
            { "doctorList._id": doctorExist._id },
            { $push: { "doctorList.$.categories": newUsageEntry } },
            { new: true }
        );

        if (!mrUser) {
            return res.status(404).send({ message: "MR is not found...!", success: false });
        }

        return res.status(201).send({ message: "Usage Data successfully push to doctor model...", success: true });

    } catch (err) {
        console.log(err);
        res.status(501).send({ message: "Failed to logged the Usage data...", success: false });
    }
}

//Get all doctor created by MR for table List....
const getAllDoctors = async (req, res) => {
    try {
        const doctorList = await mrModel.DoctorModel.find({}).populate({
            path: 'categories.categories',
            model: 'Doctors'
        });

        //Empty array to store doctor List...
        const doctorRetailList = [];

        for (doc of doctorList) {
            if (doc.categories && doc.categories.length > 0) {
                for (docCategory of doc.categories) {
                    const drLoopData = {
                        DRNAME: doc.doctorName,
                        DRscCode: doc.scCode,
                        DRCITY: doc.scCode,
                        DRLOCALITY: doc.locality,
                        DRSPECIALITY: doc.speciality,
                        DRSTATE: doc.state,
                        useDrCategory: docCategory.categoryName || '',
                        useDrFilter: docCategory.filterName || '',
                    }
                    doctorRetailList.push(drLoopData);
                }
            } else {
                const drLoopData = {
                    DRNAME: doc.doctorName,
                    DRscCode: doc.scCode,
                    DRCITY: doc.scCode,
                    DRLOCALITY: doc.locality,
                    DRSPECIALITY: doc.speciality,
                    DRSTATE: doc.state,
                    useDrCategory: '',
                    useDrFilter: '',
                }
                doctorRetailList.push(drLoopData);
            }
        }

        res.status(201).json(doctorRetailList);
    } catch (err) {
        console.log(err);
    }
}


module.exports = { createDoctor, getAllDoctors, doctorUsageController };
