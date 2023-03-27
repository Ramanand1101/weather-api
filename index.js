/* All import and export code present here */
const express=require("express")
const {connection}=require("./config/db")
const {client}=require("./config/redis")
const {UserRouter}=require("./Router/User.router");
const fetch=require('node-fetch');
const app=express();
app.use(express.json());
app.use(UserRouter);











/* Dont touch below code  */
app.listen(process.env.PORT,async()=>{
    try{
        await connection
        console.log("Connected to DB")
    }
    catch(err){
        console.log({"msg":"cannot connected to DB","error":err.message})
    }
    console.log(`Server running in PORT ${process.env.PORT}`)
})
