 
 const mongoose=require('mongoose');
 const dotenv=require('dotenv');

 dotenv.config();
 
const MongoDB=async()=>{
    try{
       await mongoose.connect(process.env.MongoDB)
       console.log("Succesfully connected to MongoDB atlas")
    }
    catch(err){
          console.log("Failed to connect database",err)
    }
}

module.exports=MongoDB;