const redis=require("redis")
const client=redis.createClient({url:"redis://default:SVuofnSXwQ8GjvrbeHPh6APZxsnLh1Yr@redis-15695.c256.us-east-1-2.ec2.cloud.redislabs.com:15695"})

client.on("error",err=>console.log("Redis Client Error",err))

client.connect()

module.exports={
    client
}