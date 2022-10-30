const express = require("express");
const mongoose = require("mongoose");
const { MONGO_USER, MONGO_PASSWORD, MONGO_IP, MONGO_PORT } = require("./config/config");

const postRouter = require("./routes/postRoutes")
const userRouter = require("./routes/userRoutes")

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
app.use(express.json());
app.get("/",(req,res)=>{
    res.send("<p>Hello!!!</p>")
});
app.use("/api/posts",postRouter);
app.use("/api/users",userRouter);
const port = process.env.PORT || 3000;

app.listen(port, ()=>console.log(`Listening on ${port}`));

