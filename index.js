const express = require("express");
const colors = require("colors");
const moragan = require("morgan");
const cors = require('cors');
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const adminRoute = require('./routes/adminRoute');
const mrRoute = require('./routes/mrRoute');
const doctorRoute = require('./routes/doctorRoute');

//dotenv conig
dotenv.config();

//Mongodb connection
connectDB();

//Rest obejct
const app = express();

//Middlewares
app.use(cors());
app.use(express.json());
app.use(moragan("dev"));
app.use(express.static('uploads'));

//routes
app.use("/api/admin", adminRoute);
app.use("/api/mr", mrRoute);
app.use("/api/doctor", doctorRoute);

//port
const port = process.env.PORT || 8000;

//Listen port
app.listen(port, () => {
    console.log(
        `Server Running in ${process.env.NODE_MODE} Mode on port ${process.env.PORT}`
            .bgCyan.white
    );
});