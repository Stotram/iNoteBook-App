const mongoose= require ("mongoose");
const mongoURI= "mongodb://0.0.0.0:27017/inotebook";

const connectToMongo = async()=>{
    await mongoose.connect(mongoURI);
    console.log("Connection established...")
}

module.exports= connectToMongo