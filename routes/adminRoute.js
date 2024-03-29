const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer();
const { loginController, registerController, addCategory, addFilters, getCategoryName, allFilter, allgetCategory, allfilterList, excelUpload, forgotPass, } = require("../controllers/adminController");

// //Multer configuration....
// const storage = multer.diskStorage({
//     destination: "./uploads",
//     filename: function (req, file, cb) {
//         const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//         cb(null, `${Date.now()} - ${file.originalname}`);
//     },
// });
// const upload = multer({ storage });


//Register by admin...
router.post("/register", registerController);

//Login by admin....
router.post("/login", loginController);

//Add category by admin...
router.post("/addCategory/:id", addCategory);

//Add filters by admin...
router.post("/addFilter", addFilters);

//Get the all category Type Name....
router.get("/getCategory", getCategoryName);

//Get all filter to a particular category...
router.post("/allFilters", allFilter);

//Get all category with their filters....
router.get("/allCategory", allgetCategory);

//Get all filters for listout....
router.get("/filterList", allfilterList);

//Excel Sheet upload POST APIs...
router.post('/upload/:id', upload.single('file'), excelUpload);

//Forget Password Route POST APIs....
router.post("/forgetPass", forgotPass);

module.exports = router;

