const express=require("express");
const {checkUser, requireAuth}=require("../helper/authMiddleware");
const galleryCtlr=require('../controller/galleryController');

const router=express.Router();
router.get("/gallery",requireAuth,checkUser,galleryCtlr.getAllImages);

router.get("/addToGallery",requireAuth,checkUser,galleryCtlr.addToGalleryGet);
router.post("/addToGallery",requireAuth,checkUser,galleryCtlr.addToGalleryPost);

router.post("/deleteGalleryImage", requireAuth,galleryCtlr.deleteImage);

router.get('/editGalleryImage/:id', galleryCtlr.editGalleryGet);
router.post('/editGalleryImage/:id', galleryCtlr.editGalleryPost);



module.exports=router;