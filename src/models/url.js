const mongoose= require ('mongoose');

const urlSchema=new mongoose.Schema({
    shortId:{
        type:String,
        required:true,
        unique:true,
    },
    redirectURL:{
        type:String,
        required:true,
    },
    visitHistory:[{timestamp:{type:Number}}],
    expiresAt:{
        type:Date,
        default:Date.now()+30*24*60*60*1000, // 30 days
    },
},
{timestamps:true}
);

const URL=mongoose.model("url",urlSchema);

module.exports=URL;
