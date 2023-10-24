const mongoose= require('mongoose');
const gallerySchema=mongoose.Schema(
{
    bnCode:{
        type: String,
        required: [true, "Please add the bn Code"]
    },	
    description:{
        type: String,
        required: [true,"please enter the description"]
    },		
    imgUrl:{
        type: String,
        required: [true, "Please add the imageURL"]
    },		
    createdOn:{
        type: Date
       
    },	
})
module.exports=mongoose.model("Gallery",gallerySchema);