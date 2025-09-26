const mongoose = require('mongoose');

const url = "mongodb://localhost:27017/rainwater";

const connectdb = async()=>{
    try{
        await mongoose.connect(url);
        console.log("Rainwater Database is Connected SuccessFully");
    }catch(err){
        console.log(err.message);
    }
}

connectdb();

const userSchema = new mongoose.Schema({
    name : {type: String, required: true},
    email : {type:String, required: true, unique: true},
    password : {type: String, required: true}
});

const User = mongoose.model("User",userSchema,"user")

module.exports = User