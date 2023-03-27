const mongoose=require("mongoose")

const userSchema=mongoose.Schema({
    name:String,
    email:String,
    password:String,
    age:String,
    date: {type:Date,default:Date.now()}
}) 

const UserModel=mongoose.model("user",userSchema)
module.exports={
    UserModel
}