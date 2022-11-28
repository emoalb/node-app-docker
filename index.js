const { MONGO_USER, MONGO_PASSWORD, MONGO_IP, MONGO_PORT, REDIS_URL, REDIS_PORT, REDIS_SECRET } = require("./config/config");
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");

const postRouter = require("./routes/postRoutes")
const userRouter = require("./routes/userRoutes");


let RedisStore = require("connect-redis")(session)
const { Session } = require("express-session");
const { createClient } = require("redis")

console.log(REDIS_URL)
let redisClient = createClient({
    url:`redis://${REDIS_URL}:${REDIS_PORT}`,
    legacyMode: true });

    (async()=>{
        console.log("Redis Connection")
         await  redisClient.connect().then(console.log("connected to redis db")).catch(console.error)
        
    })();
   
   (async ()=>{await redisClient.set("name","test redis db")
       redisClient.get("name",(err,val)=>{ console.log(val);})       
 })()



const app = express();

const mongoURL = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/?authSource=admin`;

const connectWithRetry = () =>{
    mongoose
    .connect(mongoURL)
    .then(()=>console.log("connected to DB"))
    .catch((e)=>{
        console.log(e)
        setTimeout(connectWithRetry,5000)
    }
    );
};
connectWithRetry();
app.use(session({
    store: new RedisStore({client:redisClient}),
    secret:REDIS_SECRET,
    
    cookie:{
        saveUninitialized:false,
        secure:false,
        resave:false,
        httpOnly:true,
        maxAge:3000000
    }
}))
app.use(express.json());
app.get("/",(req,res)=>{
    res.send("<p>Hello!</p>")
});
app.use("/api/v1/posts",postRouter);
app.use("/api/v1/users",userRouter);
const port = process.env.PORT || 3000;

app.listen(port, ()=>console.log(`Listening on ${port}`));

