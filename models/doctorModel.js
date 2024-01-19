// const mongoose = require('mongoose');

// const CategorySchema = new mongoose.Schema({
//     categoryName: String,
//     filterName: String,
//     filterUrl: String,
//     doc: Date
// });

// const doctorSchema = new mongoose.Schema({

//     doctorName: String,
//     scCode: {
//         type: String,
//         unique: true
//     },
//     city: String,
//     state: String,
//     locality: String,
//     speciality: String,
//     doc: Date,
//     categories: {
//         type: [CategorySchema],
//         default: [],
//     },
//     doctorList: { type: mongoose.Schema.Types.ObjectId, ref: 'MRUser' }
// }, { timestamps: true });

// const DoctorModel = mongoose.model("Doctors", doctorSchema);

// module.exports = DoctorModel;
