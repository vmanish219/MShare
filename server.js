require('dotenv').config()
const express= require("express");
const connectDB = require('./config/db');
const app=express();

app.set("view engine","ejs");
app.use(express.json());

connectDB();


//Routes

app.use("/api/files",require("./routes/files"));
app.use("/files",require("./routes/show"));
app.use("/files/download",require("./routes/download"))


const PORT= process.env.PORT || 3000;
app.listen(PORT,()=>{
    console.log("Server Running Successfully");
})