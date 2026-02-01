import jwt from 'jsonwebtoken'
import userModel from '../models/userModel.js'

const authMidelWhere = async (req,res,next)=>{
  // extracting the token from the authorization header
  // Bearer token comes in the format: "Bearer <token>"
  const authHeader = req.headers.authorization || req.headers['authorization']; // because the token is in the headers because we are using bearer token do you delete the authorization header? yes i delete it because it is not needed
  
  if(!authHeader){
    return res.json({success:false,message:"Not Authorized, login again"})
  }
  
  // Extract the actual token from "Bearer <token>"
  const token = authHeader.split(' ')[1];// because the token is encoded using the JWT_SECRET
  
  if(!token){
    return res.json({success:false,message:"Not Authorized, login again"})
  } 
  
  try {
    const token_decode = jwt.verify(token, process.env.JWT_SECRET) // because the token is encoded using the JWT_SECRET
    req.body.userId = token_decode.id; // because the token is encoded using the JWT_SECRET
    next(); // because we need to go to the next middleware
  } catch (error) {
    console.log(error);
    res.json({success:false,message:"Not Authorized, login again"})
  }
};

export default authMidelWhere;