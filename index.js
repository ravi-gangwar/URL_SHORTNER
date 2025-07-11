const express = require("express");

const dotenv = require("dotenv");
dotenv.config();

const { connectToMongoDB } = require("./src/db/connect");

const urlRoute = require("./src/routes/url");

const rateLimiter = require("./src/middleware/rateLimiter");

const { handleGetAnalytics, redirectURL } = require("./src/controllers/url.js");
const app=express();

connectToMongoDB(process.env.MONGO_URI)
.then(()=> console.log("MongoDB connected"));

app.use(express.json());

app.use(rateLimiter);

app.get("/", (req, res) => {
  res.send("Hello World");
})

app.use("/shorten",urlRoute);

app.get('/:code',redirectURL); 

app.get('/analytics/:code', handleGetAnalytics);

app.listen(process.env.PORT,()=>console.log(`Server Started at PORT:${process.env.PORT}`));
