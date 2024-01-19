const adminModel = require('../models/adminModel');
const doctorModel = require("../models/doctorModel");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");

//Admin register controller....
const registerController = async (req, res) => {
    try {
        const userExist = await adminModel.Admin.findOne({ adminId: req.body.adminId });

        if (userExist) {
            return res.status(201).send({ message: "Admin is already exist", success: false });
        }
        // const password = req.body.password;
        // const salt = await bcrypt.genSalt(10);
        // const hashedPassword = await bcrypt.hash(password, salt);
        // req.body.password = hashedPassword;
        const admin = new adminModel.Admin(req.body);
        const adminRegister = await admin.save();
        if (adminRegister) {
            return res.status(201).send({ message: "Admin register successfully...", success: true });
        }
    } catch (err) {
        console.log(err);
        res.status(500).send({ message: "Admin failed to register...", success: false });
    }
}

//Admin login controller....
const loginController = async (req, res) => {
    try {
        const user = await adminModel.Admin.findOne({ adminId: req.body.adminId });

        if (!user) {
            return res.status(201).send({ message: "Admin not found..!", success: false });
        }

        const getPassword = req.body.password;
        if (getPassword.length > 8) {
            return res.status(201).send({ message: "Admin password must be less then 8 character...", success: false });
        }

        if (user.password !== getPassword) {
            return res.status(201).send({ message: "Admin Credentials is incorrect...!", success: false });
        }

        const adminID = await user._id;

        //Token generation....
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "1d",
        });

        res.status(202).send({ message: "Admin login successfully...", success: true, token, data: adminID });
    } catch (err) {
        console.log(err);
        res.status(500).send({ message: "Admin failed to login...", success: false });
    }
};

//Add Categories by admin....
const addCategory = async (req, res) => {
    try {
        const adminId = req.params.id;
        const { categoryName } = req.body;

        //Check category present or not...
        const categoryExist = await adminModel.CategoryType.findOne({ categoryName });
        if (categoryExist) {
            return res.status(201).send({ message: "Category Already Exist...!", success: false });
        }

        //Check the admin is exist or not...
        const adminExist = await adminModel.Admin.findById(adminId).populate({
            path: 'categories',
            populate: {
                path: 'categories.categoryType',
                model: 'Filters'
            }
        });
        if (!adminExist) {
            return res.status(201).send({ message: "Admin not found...!", success: false });
        }

        //Store the category in model...
        const newCategory = await adminModel.CategoryType({
            categoryName,
            categories: adminId
        });

        const storeCategory = await newCategory.save();
        const categoryId = await storeCategory._id;


        adminExist.categories.push(storeCategory);
        await adminExist.save();

        res.status(201).send({ message: "Category is being added successfully...", success: true, data: categoryId });

    } catch (err) {
        console.log(err);
        return res.status(501).send({ message: "Category is failed to Add in model...", success: false });
    }
};

//Add Filters by admin...
const addFilters = async (req, res) => {
    try {
        const categoryId = req.params.id;
        const { filterName } = req.body;
        const filterUrl = req.file.filename;

        //Check Category Exist or not...
        const categoryTypeExist = await adminModel.CategoryType.findById(categoryId).populate('categoryType');
        if (!categoryTypeExist) {
            return res.status(201).send({ message: "Category is not exists...!", success: false });
        }

        //Add filter in Model...
        const newFilter = await adminModel.Filter({
            filterName,
            filterUrl,
            categoryType: categoryId
        });

        //Store in Filters model...
        const storedFilter = await newFilter.save();

        //Push into particular category....
        categoryTypeExist.categoryType.push(storedFilter);
        await categoryTypeExist.save();

        // Populate the 'categories' field in the Admin schema, including the 'categoryType' field
        const adminExist = await adminModel.Admin.findOne({ "categories._id": categoryId }).populate({
            path: 'categories',
            populate: {
                path: 'categoryType',
                model: 'Filters'
            }
        });

        if (!adminExist) {
            return res.status(201).send({ message: "Admin not found...!", success: false });
        }

        // Update the Admin schema with the new filter
        const categoryIndex = adminExist.categories.findIndex(cat => cat._id.equals(categoryId));
        adminExist.categories[categoryIndex].categoryType.push(storedFilter);
        await adminExist.save();

        return res.status(201).send({ message: "Filters is added successfully....", success: true });

    } catch (err) {
        console.log(err);
        res.status(501).send({ message: "Failed to add filter in model...!", success: false });
    }
};

//Get the all category Type Name....
const getCategoryName = async (req, res) => {
    try {
        const allCategory = await adminModel.CategoryType.find({}, 'categoryName');

        //Fetch only the categoryName...
        const catName = allCategory.map(category => category.categoryName);

        if (!catName) {
            return res.status(201).send({ message: "Category Name is failed to fetch...", success: false });
        }

        return res.status(201).send({ message: "All Category Name fetched successfully...", success: true, data: catName });

    } catch (err) {
        console.log(err);
        res.status(501).send({ message: "Failed to fetched the category name...!", success: false });
    }
}

//Get all filter to a particular category...
const allFilter = async (req, res) => {
    try {
        const categoryNameInput = req.body.categoryName;

        //Fetch Filter from category...
        const categoryTypeExist = await adminModel.CategoryType.findOne({ categoryName: categoryNameInput }).populate('categoryType');

        if (!categoryTypeExist) {
            return res.status(404).send({ message: "Category Not Found...!", success: false });
        }

        const fetchFilter = categoryTypeExist.categoryType;

        if (fetchFilter.length === 0) {
            return res.status(404).send({ message: "No filters found for the specified category.", success: false })
        }

        //Fetch only filterName & filterUrl...
        const filterField = fetchFilter.map(fetchData => ({
            filterName: fetchData.filterName,
            filterUrl: fetchData.filterUrl,
        }));

        res.status(201).send({ message: "Filter fetched successfully of selected category..", success: true, data: filterField });
    } catch (err) {
        console.log(err);
        res.status(201).send({ message: "Failed Filter fetched ", success: false });
    }
}

module.exports = { loginController, registerController, addCategory, addFilters, getCategoryName, allFilter };