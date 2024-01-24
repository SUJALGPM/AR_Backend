const mongoose = require('mongoose');

//Doctor Usage track...
const CategorySchema = new mongoose.Schema({
    categoryName: String,
    filterName: String,
    doc: {
        type: Date,
        default: Date.now
    },
    categories: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctors' }
});

//Doctor Schema...
const doctorSchema = new mongoose.Schema({
    doctorName: String,
    scCode: {
        type: String,
        unique: true
    },
    city: String,
    state: String,
    locality: String,
    speciality: String,
    doc: {
        type: Date,
        default: Date.now
    },
    categories: {
        type: [CategorySchema],
        default: [],
    },
    doctorList: { type: mongoose.Schema.Types.ObjectId, ref: 'MRUser' }
}, { timestamps: true });


//MR Schema....
const userSchema = new mongoose.Schema({
    adminId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin',
        required: true,
    },
    MRId: {
        type: String,
        required: true
    },
    MRname: {
        type: String,
        required: true
    },
    DIV: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    DOJ: {
        type: Number,
        required: true
    },
    DESG: {
        type: String,
        required: true
    },
    HQ: {
        type: String,
        required: true
    },
    doctorList: {
        type: [doctorSchema],
        default: []
    },
}, { timestamps: true });

const MR = mongoose.model('MRUser', userSchema);
const DoctorModel = mongoose.model("Doctors", doctorSchema);
const doctorUsage = mongoose.model("doctorUsage", CategorySchema);

module.exports = { MR, DoctorModel, doctorUsage };
