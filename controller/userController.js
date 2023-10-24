const {json} =require("express");
const bycrypt=require("bycrypt");
const async=require('express-async-handler');
const user=require("../models/userModel");
const provideRegForm=asyncHandler(async(req,res)=>
{
    res.render('registerUser');
}
)
const registerUser=asyncHandler(async(req,res)=>
{
    const {bncode,bnname,email,password}=req.body;
    if(!bncode,!bnname,!email,!password)
    {
        res.status(400);
        throw new Error("All fields are mandatory");
    }
    const userExists= await UserActivation.findOne({email});
    if(userExists)
    {
        res.status(400);
        throw new Error ("User already Created with this email");
    }
    
}
);