import mongoose from "mongoose";



const userSchema = new mongoose.Schema({
    firstName:{type:String,required:true},
    lastName:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true},
    cartData:{type:Object,default:{}},
},{minimize:false})//creating user schema with firstName, lastName, email, password and cartData fields

//if minimize is set to false, mongoose will not remove empty objects from the document
//this is useful for cartData field which can be an empty object when user has no items in cart


const userModel = mongoose.models.user || mongoose.model("user",userSchema);
export default userModel;