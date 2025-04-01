import jwt from 'jsonwebtoken'
import AppError from '../utills/error.utills.js';
 const isLoggedIn=async (req,res,next)=>{
  const {token}=req.cookies;
  if(!token){
    return next(new AppError('email or password does not match',400));
  }

  const userDetails= await jwt.verify(token,"SECRET");
  req.user=userDetails;
 
  next();
}
const authorizedRoles=(...roles)=>async (req,res,next)=>{
  const CurrentRole=req.user.role;
  if(!roles.includes(CurrentRole)){
    return next(new AppError('you do not have perrmission to access it',400));
  }
  next();
}
export { isLoggedIn,
  authorizedRoles};