const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const feedRoutes = require('./routes/feed');

const app = express();
//app.use(express.json())
app.use(bodyParser.json())
require("dotenv").config();

app.use((req,res,next)=>{
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
   // res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
    next();
})

app.use('/feed',feedRoutes)

mongoose.connect(
  process.env.MONGO_URI
).then(result => {
console.log("mongoose connected");
app.listen(8000);
}).catch(err => console.log(err));

