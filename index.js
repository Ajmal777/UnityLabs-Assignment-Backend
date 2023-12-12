const express = require("express");
const mongoose = require("mongoose");

require("dotenv").config();
require("./utils/connectDb.js");

const cors = require("cors");
const error = require("./Middlewares/error.js");
const routes = require('./Routes');

const app = express();
const PORT = process.env.PORT;

// Add middlewares
app.use(express.json());
app.use(
    cors({
        origin: "*",
    })
);

app.use('/api', routes);
app.use(error);

app.listen(PORT, () => console.log("server started"));
