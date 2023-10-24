const path=require('path');
const express=require('express');
const bodyParser=require('body-parser');
const dotenv=require("dotenv").config();
const mongoose= require('mongoose');
const multer=require('multer');
const authRoutes=require("./routes/authRoutes");
const galleryRoutes=require('./routes/galleryRoutes')
const connectToMongoDB=require("./config/localDbconnection");
const cookieParser=require('cookie-parser');
const {checkUser, requireAuth}=require("./helper/authMiddleware");
connectToMongoDB();
const jwt = require('jsonwebtoken');
const User = require('./models/userModel');
const app=express();
app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.urlencoded({extended:false}));
app.set('view engine', 'ejs');
app.use('/images',express.static(path.join(__dirname, 'images')));
app.use('/css',express.static(path.join(__dirname, 'css')));


// configure multer to upload images
const fileStorage =multer.diskStorage({
  destination :(req, file ,cb)=> {
      cb(null, 'images');
  },
  filename: (req, file , cb)=>{
      cb(null, Date.now() + file.originalname);
  }    
});
app.use(multer({storage:fileStorage}).single('image'));

app.use(express.json());
app.use(authRoutes);
app.use(galleryRoutes);
app.get('/dashBoard',requireAuth,checkUser,(req,res)=>{ 
  res.render('dashboardNcc');
})

app.listen(3000);