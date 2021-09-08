require('dotenv').config();
const mongoose=require("mongoose")

const connectDB=()=>{
    mongoose.connect(process.env.URI, {useNewUrlParser: true,useUnifiedTopology: true});
    const connection=mongoose.connection;
}

module.exports= connectDB;