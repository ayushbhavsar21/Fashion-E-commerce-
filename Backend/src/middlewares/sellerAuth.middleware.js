import { Seller } from "../models/seller.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from 'jsonwebtoken';


export const verifySellerJWT = asyncHandler(async(req,res,next)=>{
   try {
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","");
 
    if(!token){
     throw new ApiError (401, "Unauthorized request!!");
    }
 
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
 
    const user = await Seller.findById(decodedToken?._id).select("-password -refreshToken");
 
    if(!user){
     throw new ApiError(401, "Invalid Access Token");
    }
 
    req.user = user;
    
    next();
   } catch (error) {
    throw new ApiError(401, error?.message || "Invalid access token!!");
   }
})