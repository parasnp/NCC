const { locales } = require('validator/lib/isIBAN');
const Gallery=require('../models/galleryModel');
const jwt= require("jsonwebtoken");
const path=require('path');
const fileHelper=require("../helper/file");


module.exports.addToGalleryGet=(req,res)=>
{
  res.render('addToGallery');
}


module.exports.addToGalleryPost=async(req,res)=>
{      
    const description = req.body.description; 
    //get the current user who will upload the image
    const bnCode=res.locals.CurrentUser.bnCode; 
    
    const createdOn= new Date();
    const image=req.file;
    if(!image){
      res.status(400);
      throw new Error("error in image");
    }
    //set the path of image to the images folder
      const imgUrl="/images/"+image.filename

    // write the info to db
    try {
      const gallObj = await Gallery.create({
          bnCode,
          description,
          imgUrl,
          createdOn
      });     
      res.redirect("/gallery");   

      } catch (error) {
          console.error(error);
          res.status(500).send("Error creating gallery image");
      }    

}

module.exports.getAllImages= async(req, res)=>{   
  
  const bnCode=res.locals.CurrentUser.bnCode; 
  // find all Gallery images uploaded by currentUser 
  const gall = await Gallery.find({ bnCode: bnCode });
    console.log(gall);     
    res.render("gallery",{    
    gallObj:gall,
    path:"gallery"
  });
}


module.exports.deleteImage = async(req, res)=>{
  const imageId=req.body.imageId;
console.log(imageId)
const gallObj=await Gallery.findByIdAndRemove(imageId); 

const imageFilename = path.basename(gallObj.imgUrl);
const imagePath = path.join(__dirname, '..', 'images', imageFilename);
try{
  await fileHelper.deleteImageFile(imagePath);
}catch{
  res.status(400);
  throw new Error("err in removing file from folder");
} 
res.redirect("/gallery");  
}

module.exports.editGalleryGet=async(req,res)=>
{

  console.log(req.params.id);
  const gallObj = await Gallery.findById(req.params.id);
  if(!gallObj){
      res.status(400);
      throw new Error("Image not found");
    } 
    
    res.render('galleryEditForm',{
      gallObj,
      path:"gallery"
    });
}


module.exports.editGalleryPost=async(req, res)=>{
 
  // Retrieve form data from req.body
  const e_description = req.body.description; 
  const image=req.file;
    if(!e_description ){
      res.status(400);
      throw new Error("please enter description");
      }


    // if the admin does not change the image
    if(!image){
      const edited=await Gallery.findByIdAndUpdate(
        req.params.id,
        {description: e_description},
        {new:true}
      );          
    }
    // if admin changes the image
    else{  
      //remove the old image from file system, get the imageUrl of the old image 
      const gallObj = await Gallery.findById(req.params.id);
      //construct the path to the images folder
      const imageFilename = path.basename(gallObj.imgUrl);
      const imagePath = path.join(__dirname, '..', 'images', imageFilename);
      // delete the old image from the images folder
      try{
        await fileHelper.deleteImageFile(imagePath);
      }catch{
        res.status(400);
        throw new Error("err in removing file from folder");
      } 
      //add the info of new image       
      const EditedImgUrl="/images/" +image.filename;     
      const edited= await Gallery.findByIdAndUpdate(
        req.params.id,
        {description: e_description, imgUrl:EditedImgUrl},
        {new:true}
      );
    }     
    res.redirect("/gallery");       
    
}
  
      

  
    
  



