const mongoose = require('mongoose');

const FilterSchema = new mongoose.Schema({
    filterName: String,
    filterUrl: String,
    categoryType: { type: mongoose.Schema.Types.ObjectId, ref: 'CategoryType' },
}, { timestamps: true });

const CategoryTypeSchema = new mongoose.Schema({
    categoryName: String,
    categoryType: {
        type: [FilterSchema],
        default: []
    },
    categories: { type: mongoose.Schema.Types.ObjectId, ref: 'categories' },
}, { timestamps: true });

const adminSchema = mongoose.Schema({
    adminId: {
        type: String,
        required: true,
    },
    adminName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: false
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: 1
    },
    categories: {
        type: [CategoryTypeSchema],
        default: [],
    },
}, { timestamps: true });

const Filter = mongoose.model('Filters', FilterSchema);
const CategoryType = mongoose.model('CategoryType', CategoryTypeSchema);
const Admin = mongoose.model('Admin', adminSchema);

module.exports = { Filter, CategoryType, Admin };
