const mongoose=require("mongoose")
require("dotenv").config()
/* here we establish connection betweeen mongoAtlas and local-server */
const connection=mongoose.connect(process.env.MONGOURL)

module.exports={
    connection

}