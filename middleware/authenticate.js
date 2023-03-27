const jwt = require("jsonwebtoken");
const { client } = require("../config/redis");
require("dotenv").config();

const auth = async (req, res, next) => {

    let token = await client.get("token");
    console.log(token);
    
    if (token) {
  
        if (!await client.lPos("blackListTokens", token)) {
          
            jwt.verify(token, process.env.JWT_TOKEN, (err, decoded) => {
                if (decoded) {
                    req.body.userid = decoded.userid;
                    next();
                }
            })
        }else{
         
            res.send("log in first!")
        }
    } else {
 
        let refreshToken=await client.get("refreshToken");
       
        if(refreshToken){
      
            if(await client.lPos("blackListTokens",refreshToken)){
                return res.send("login again");
            }else{
         
                jwt.verify(refreshToken,process.env.JET_REFRESH_SECRET,async(err,decoded)=>{
                    if(decoded){
                        let userid=decoded.userid;
                        let token=jwt.sign({userid:userid},process.env.JWT_TOKEN);
                        await client.set("token",token);
                        req.body.userid=userid;
                        next();
                    }else{
                        res.send("log in again!")
                    }
                })
            }
        }else{
            res.send("login first");
        }
    }
}

module.exports = {
    auth
}