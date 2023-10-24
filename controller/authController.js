
const { model } = require('mongoose');
const User=require('../models/userModel');
const jwtToken=require("jsonwebtoken");
//handel error in the user input
const handleErrors=(e)=>{
      console.log(e.message, e.code);
      //create an object called error that will have all properties matching the fileds in user model
      let myErrors={bnCode:' ',bnName:' ',email:' ',password:' '};
      if(e.code===11000){
          myErrors.email ="duplicate email!!";
          return myErrors;
      }
      if(e.message==="invalid password")
      { 
        myErrors.password="invalid password";
      }
      if(e.message==="invalid email")
      {
        myErrors.email="invalid email";
      }
      //validation errors
      if(e.message.includes("User validation failed"))
      {
          Object.values(e.errors).forEach(({properties})=>{
              myErrors[properties.path]=properties.message;
          })       
      }
        return myErrors;
}

const createToken=(user)=>{
  return jwtToken.sign(
    {
      user:{
        userName : user.userName,
        email:user.email,
        bnCode:user.bnCode,
        id: user.id,       
       
      },
    },
    process.env.SECRET_TOKEN_VALUE,
    {expiresIn: '60m'}
  );
}

module.exports.signup_get=(req,res)=>
{
  res.render('signup');
}


module.exports.signup_post=async(req,res)=>{
  const{bnCode,bnName,email,password}=req.body;
  try{
      const user= await User.create({bnCode,bnName,email,password});
      const accessToken=createToken(user);
      res.cookie('jwt',accessToken,{httpOnly: true});
      res.status(201).json({user:user._id});      
  }catch(e)
  {
     const err=handleErrors(e);
     res.status(400).json({err});
  }
}



module.exports.dashBoard_get=(req,res)=>
{
  res.render('dashboardNcc');
}


module.exports.logout_get=(req,res)=>
{
  res.cookie('jwt','',{maxAge:1});
  res.redirect('/login');
}


module.exports.login_get=(req,res)=>
{
  res.render('login');
}


module.exports.login_post=async(req,res)=>
{
  const {email,password}=req.body;
  try
  {
    const user= await User.login(email,password);
    console.log(user);
    const accessToken=createToken(user);
    res.cookie('jwt',accessToken,{httpOnly: true});
    res.status(201).json({user:user._id});
  }
  catch(e)
  {
    const err=handleErrors(e);
    res.status(400).json({err});
  }
}