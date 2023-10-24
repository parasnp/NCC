const jwt= require("jsonwebtoken");
const User=require("../models/userModel")

const requireAuth=(req,res,next)=>
{
    
    const token=req.cookies.jwt;
    if(token)
    {
        jwt.verify(token,process.env.SECRET_TOKEN_VALUE,(err,decodedToken)=>{
            if(err)
            {
                console.log(err.message);
                res.redirect('/login');
            }
            else
            {               
                next();
            }
        })
    }
    else
    {
        res.redirect('/login');
    }
}

const checkUser=(req,res,next)=>{
    console.log("in checkuser middleware");

    const token=req.cookies.jwt;
    if(token)
    {
        jwt.verify(token,process.env.SECRET_TOKEN_VALUE,async (err,decodedToken)=>{
            if(err)
            {
            console.log(err.message);
            res.locals.CurrentUser=null;
           
            }
            else{
                res.locals.CurrentUser=decodedToken.user;
                console.log("in check user decoded token valu of currentUser");         
                console.log(res.locals.CurrentUser);               
            }
            });
            next();
    }
}

module.exports={requireAuth,checkUser};