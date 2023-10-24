const mongoose= require('mongoose');
const {isEmail}=require('validator');
const  bcrypt=require('bcrypt');
const userSchema= mongoose.Schema(
  {
        
    bnCode:{
        type: String,
        required: [true, "Please add the bn Code"]
    },
    bnName:{
        type: String,
        required: [true, "Please add the contact name"]
    },
    email:{
        type: String,
        required: [true, "Please add the contact email"],
        unique:[true, "email address already registered"],
        validate:[isEmail,'Please enter a valid email']
    },
    password:{
        type: String,
        required: [true, "Please add the user password"],
        minlength:[6, 'Minimum passwaord lenght is 6 characters']
    }
},
{timestamps : true}
);
userSchema.pre('save',async function(next){
  const salt=await bcrypt.genSalt();
  this.password=await bcrypt.hash(this.password,salt);
  next();
})
userSchema.statics.login=async function(email,password)
{
  const user=await this.findOne({email});
  if(user){
   const auth=await bcrypt.compare(password,user.password);
   if(auth)
   {return user;}
   throw Error("invalid password")
  }
  throw Error("invalid email")
}
module.exports=mongoose.model("User",userSchema);