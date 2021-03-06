const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const feedRoutes = require('./routes/feed');
const path = require('path');
const multer = require('multer');
const { v4: uuidv4 } = require("uuid");
const authRoutes = require("./routes/auth");

const app = express();

// const fileStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "images");
//   },
//   filename: (req, file, cb) => {
//     cb(null, new Date().toISOString() + "-" + file.originalname);
//   },
// });

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "images");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});

const upload = multer({ storage: storage });

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};


app.use(bodyParser.json())
app.use(
  multer({ storage: storage,fileFilter: fileFilter }).single("image")
);
app.use("/images", express.static(path.join(__dirname, "images")));

require("dotenv").config();

app.use((req,res,next)=>{
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
    next();
})

app.use('/feed',feedRoutes)
app.use("/auth", authRoutes);


app.use((error,req,res,next) => {
    console.log(error);
    const status =error.statusCode || 500;
    const message=error.message
    const data = error.data;
    res.status(status).json({ message: message, data: data });
});

mongoose.connect(
  process.env.MONGO_URI
).then(result => {
console.log("mongoose connected");
app.listen(8000);
}).catch(err => console.log(err));

