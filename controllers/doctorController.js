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

        // Conditionally include scCode if provided
        if (newDataMR.scCode !== undefined) {
            // Validate scCode if provided
            if (newDataMR.scCode.trim() === "") {
                return res.status(400).send({ message: "scCode cannot be an empty string", success: false });
            }
        } else {
            // If scCode is not provided, exclude it from the document
            delete newDataMR.scCode;
        }

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

//Post APIs for static doctor Usage...
const doctorStaticUsage = async (req, res) => {
    try {
        const { mrID, doctorName, doctorCatName, doctorFilterName, doctorSpec, doctorCity, doctorState, doctorStatus } = req.body;

        const mrExist = await mrModel.MR.findById(mrID).populate('staticDrList');

        if (!mrExist) {
            return res.status(404).send({ message: "MR not found..!!!", success: false });
        }

        if (!doctorStatus) {
            return res.status(404).send({ message: "Failed to recieve status..!!!!", success: false });
        }

        if (!doctorName) {
            return res.status(404).send({ message: "Doctor Not Found..!!!!", success: false });
        }

        if (!doctorCatName && !doctorFilterName) {
            return res.status(404).send({ message: "Doctor Category || Filter Not used.!!!", success: false });
        }

        const usageData = {
            doctorName: doctorName || null,
            doctorCatName: doctorCatName || null,
            doctorFilterName: doctorFilterName || null,
            doctorSpec: doctorSpec || null,
            doctorCity: doctorCity || null,
            doctorState: doctorState || null,
            doctorStatus: doctorStatus,
            staticDrList: mrID
        };

        const trackUsage = new mrModel.staticUsage(usageData);
        const recordUsage = await trackUsage.save();

        mrExist.staticDrList.push(recordUsage);
        const mrModelListUpdate = await mrExist.save();

        if (mrModelListUpdate) {
            return res.status(201).send({ message: "Static Doctor Usage track Successfully.....", success: true });
        }


    } catch (err) {
        console.log(err);
        res.status(500).send({ message: "Failed to track the doctor usage...!!!!", success: false });
    }
}

// //Get APIs for static Dr Table List(Detailed Report) Aggregate....
// const listStaticUsage = async (req, res) => {
//     try {

//         // //$addToSet operator also be used to get unique value from group document it can be used in replace of $push...
//         const groupedDoctors = await mrModel.staticUsage.aggregate([
//             {
//                 $group: {
//                     _id: "$mrId",
//                     doctors: {
//                         $push: {
//                             mrID: "$mrId",
//                             DRNAME: "$doctorName",
//                             DRCATEGORYNAME: "$doctorCatName",
//                             DRFILTERNAME: "$doctorFilterName",
//                             DOCTORSPEC: { $ifNull: ["$doctorSpec", ""] },
//                             DOCTORCITY: { $ifNull: ["$doctorCity", ""] },
//                             DOCTORSTATE: { $ifNull: ["$doctorState", ""] },
//                             DOCTORSTATUS: "$doctorStatus"
//                         }
//                     }
//                 }
//             },
//             {
//                 $unwind: "$doctors" // Unwind the array to get separate objects
//             },
//             {
//                 $replaceRoot: { newRoot: "$doctors" } // Replace the root with the doctors field
//             },
//             {
//                 $project: {
//                     _id: 0
//                 }
//             }
//         ]);

//         // Send the response with the grouped data
//         res.status(201).json(groupedDoctors);
//     } catch (err) {
//         console.log(err);
//         res.status(500).send({ message: "Failed to load the stored record..!!!", success: false });
//     }
// }

//Get APIs for static Dr Table List(Detailed Report)....
const listStaticUsage = async (req, res) => {
    try {
        const mrData = await mrModel.MR.find({});

        if (!mrData) {
            return res.status(404).send({ message: "Failed to load the mrData..!!!", success: false });
        }

        //Empty array to store the loop data...
        const staticDrList = [];

        //Loop the mrData...
        for (mr of mrData) {
            if (mr.staticDrList && mr.staticDrList.length > 0) {
                for (doctor of mr.staticDrList) {
                    const drReport = {
                        DIV: mr.DIV,
                        STATE: mr.state,
                        MRCODE: mr.MRId,
                        MRNAME: mr.MRname,
                        HQ: mr.HQ,
                        DESG: mr.DESG,
                        DRNAME: doctor.doctorName || '',
                        DRSPECIALITY: doctor.doctorSpec || '',
                        DRCITY: doctor.doctorCity || '',
                        DRSTATE: doctor.doctorState || '',
                        DRstatus: doctor.doctorStatus || '',
                        DRcategoryUse: doctor.doctorCatName || '',
                        DRfilterUse: doctor.doctorFilterName || '',
                    }
                    staticDrList.push(drReport);
                }
            } else {
                const drReport = {
                    DIV: mr.DIV,
                    STATE: mr.state,
                    MRCODE: mr.MRId,
                    MRNAME: mr.MRname,
                    HQ: mr.HQ,
                    DESG: mr.DESG,
                    DRNAME: '',
                    DRSPECIALITY: '',
                    DRCITY: '',
                    DRSTATE: '',
                    DRstatus: '',
                    DRcategoryUse: '',
                    DRfilterUse: '',
                }
                staticDrList.push(drReport);
            }
        }

        //Response data in pure objects...
        res.status(201).json(staticDrList);

    } catch (err) {
        console.log(err);
        res.status(500).send({ message: "Failed to load the stored record..!!!", success: false });
    }
}

module.exports = { createDoctor, getAllDoctors, doctorUsageController, doctorStaticUsage, listStaticUsage };
