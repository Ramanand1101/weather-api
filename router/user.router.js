const express=require("express");
const jwt=require("jsonwebtoken");
const bcrypt=require("bcrypt");
require("dotenv").config();
const {client}=require("../config/redis");
const {UserModel}=require("../Model/User.model");
const UserRouter=express.Router();
const{logger}=require("../config/logger")

const {auth}=require("../middleware/authenticate");
UserRouter.get("/",(req,res)=>{
    res.send("Welcome to the USer page");
})

UserRouter.post("/signup",async(req,res)=>{
    let user=req.body;
    try{
     
        let temp=await UserModel.findOne({"email":user.email});
        if(temp) return res.send("already registerd");

        bcrypt.hash(user.password,5,async(err,hash)=>{
            if(err) return res.send("something wrong");
            else{
                user.password=hash;
                logger.log("info",`${req.url},${req.method}`)
                user=new UserModel(user);
                await user.save();
                res.send("new user registerd");
            }
        })

    }catch(err){
        res.send({"error":err.message});
    }
})


UserRouter.post("/login",async(req,res)=>{
    try{
        let user=req.body;
     
        let temp= await UserModel.findOne({"email":user.email});
    
        if(!temp) return res.send("not registerd");

        bcrypt.compare(temp.password,user.password,async(err,decoded)=>{
            if(err)return res.send({"error":"wrong password"});
            
            let token=jwt.sign({userid:temp._id},process.env.JWT_TOKEN,{expiresIn:60});
            let refreshToken=jwt.sign({userid:temp._id},process.env.JWT_REFRESH_SECRET,{expiresIn:240});
          
            await client.setEx("token",60,token);
         
            await client.setEx("refreshToken",240,refreshToken);
            res.send("logged in Successfully");
            console.log(temp);
        })
    }catch(err){
        res.send({"error":err.message});
    }
})

UserRouter.get("/test",auth,async(req,res)=>{
    let token=await client.get("token");
    let refreshToken=await client.get("refreshToken");
    console.log({token},"\n",{refreshToken});
    
    res.send("token are present here");
})

UserRouter.get("/logout",auth,async(req,res)=>{
    let token=await client.get("token");
    let refreshToken=await client.get("refreshToken");
    await client.rPush("blackListTokens",token,refreshToken);;

    let arr=await client.lRange("blackListTokens",0,-1);
    console.log(arr);
    res.send("logged out successfully");
    
})


module.exports={
    UserRouter
}