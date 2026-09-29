const express = require("express");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes.js");
const connectDB = require("./config/db.js");

const app = express();

app.use(express.json());

app.use("/api/auth" , authRoutes);

app.listen(5000 , () => {
    console.log("Server running on port 5000");
});

connectDB();