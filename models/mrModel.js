const mongoose = require('mongoose');

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
    }
}, { timestamps: true });

const MR = mongoose.model('MRUser', userSchema);

module.exports = MR;
