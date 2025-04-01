//import User from "../models/user.model.js";
//multer use-> koi bhi request jo multidata/formdata hoga and wah kai bhi key contaain karta hoga to usay upload akro and finally jo url create ho rha hai usay req may return kar do
import User from "../models/user.model.js";
import AppError from "../utills/error.utills.js";
import cloudinary from 'cloudinary'
import sendEmail from "../utills/sendemail.js";
import crypto from 'crypto';
import path from 'path'
import { fileURLToPath } from 'url';
//import { dirname } from 'path';

import fs from 'fs/promises'

const cookieOptions={
  maxAge:7*24*60*60*1000,
  httpOnly:true,
  secure:true

}



const register = async (req, resp, next) => {
  const { fullName, email, password } = req.body;
  if (!fullName || !email || !password) {
    return next(new AppError('All fields are required', 400));
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    return next(new AppError('Email already exists', 400));
  }

  const user = await User.create({
    email, fullName, password,
    avatar: {
      public_id: email,
      secure_url: 'https://via.placeholder.com/150'
    }
  });

  if (!user) {
    return next(new AppError('User registration failed, please try again', 400));
  }

  // TODO: File upload



  // Run only if user sends a file
  if (req.file) {
    try {
      const result = await cloudinary.v2.uploader.upload(req.file.path, {
        folder: 'lms', // Save files in a folder named lms
        width: 250,
        height: 250,
        gravity: 'faces', // This option tells cloudinary to center the image around detected faces (if any) after cropping or resizing the original image
        crop: 'fill',
      });

      
      if (result) {
        // Set the public_id and secure_url in DB
        user.avatar.public_id = result.public_id;
        user.avatar.secure_url = result.secure_url;

        // After successful upload remove the file from local storage
        fs.rm(`uploads/${req.file.filename}`);
      }
    } catch (error) {
      return next(
        new AppError(error || 'File not uploaded, please try again', 400)
      );
    }
  }

  // Save the user object
  await user.save();

  // Generating a JWT token
  console.log(user.genrateJWTToken)
  const token = await user.generateJWTToken();

  // Setting the password to undefined so it does not get sent in the response
  user.password = undefined;

  // Setting the token in the cookie with name token along with cookieOptions
  resp.cookie('token', token, cookieOptions);

  // If all good send the response to the frontend
  console.log("rech at the end ")
  resp.status(201).json({
    success: true,
    message: 'User registered successfully',
    user,
  });
};








const login=async (req,resp,next)=>{
  try{
const {email,password}=req.body;

if(!email||!password){

  return next(new AppError('all feilds are required',400));
}

const user=await User.findOne({
  email
}).select('+password');

if(!user||!user.comparePassord(password)){
  return next(new AppError('email or password does not match',400));
}
const token=await user.generateJWTToken();
user.password=undefined;
resp.cookie('token',token,cookieOptions);
resp.status(200).json({
  success:true,
  message:'user login successfully',
  user,
})
  }
  catch(e){
    next(new AppError(e.message,503));
  }
}


const logout = (req, resp) => {

  resp.cookie('token', null, {
    secure: false,
    maxAge: 0,
    httpOnly: true
  });
  resp.status(200).json({
    success: true,
    message: 'User logged out successfully'
  });
};



const getprofile=async(req,resp)=>{

try{
  const userId=req.user.id;
  const user=await User.findById(userId);
  resp.status(200).json({
    success:true,
    message:'User details',
    user,
  })
}
catch(e){
return next(new AppError('email or password does not match',400));
}

}
const forgotPassword=async(req,resp,next)=>{
const {email}=req.body;
console.log( 'send emial is -> ', email);
if(!email){
  return next(new AppError('email is required', 400));
}
const user=await User.findOne({ email});
if(!user){
  return next(new AppError('email not  registered', 400));
}
const resetToken=await user.genratePasswordResetToken();

await user.save();

const resetPasswordURL=`${"http://localhost:5173/"}reset-password/${resetToken}`
const message=`you can change your password by clicking <a href= ${resetPasswordURL} target="_blank>Reset Password</a>`;


const subject='reset password'
try{
  const val={email,subject,message};
  await sendEmail(val);
  resp.status(200).json({
    success:true,
    mesaage:`reset password Token has beeb send to ${email} successfully`
  })

}catch(e){
  user.forgetPasswordToken=undefined;
  user.forgetPassordExpiary=undefined;
  await user.save();
  return next(new AppError(e.message, 500));
}

}
const resetPassword=async(req,resp,next)=>{
const {resetToken}=req.params;
const {password}=req.body;
console.log("reset->",resetToken,"password-> ",password)
const forgetPasswordToken=crypto.createHash('sha256').update(resetToken).digest('hex');
console.log('Hashed Token:', forgetPasswordToken);
const user =await User.findOne({forgetPasswordToken});
console.log("user ->",user);
if(!user){
  console.log("token is invalid")
  return next(new AppError('Token is invalid or expired please try again', 400));
}
user.password=password;
user.forgetPasswordToken=undefined;
  user.forgetPassordExpiary=undefined;
  await user.save();
  resp.status(200).json({
    success:true,
    message:"password changed successefully"
  })

}
const changePassord=async(req,resp)=>{
const {oldPassword,newPassword}=req.body;
const {id}=req.user;
if(!oldPassword||!newPassword){
  return next(new AppError('All fields are required', 400));
}
const user=await User.findById(id).select('+password');
if(!user){
  return next(new AppError('User does not exist', 400));
}
const isPasswordValid=await user.comparePassord(oldPassword);
if(!isPasswordValid){
  return next(new AppError('Invalid old Password', 400));
}
user.password=newPassword;
await user.save();
user.password=undefined;
resp.status(200).json({
success:true,
mesaage:'password changed successfully!'
})
};

const updateUser = async (req, res, next) => {
  // Destructuring the necessary data from the req object
  const { fullName } = req.body;
  const { id } = req.params;

  const user = await User.findById(id);

  if (!user) {
    return next(new AppError('Invalid user id or user does not exist'));
  }

  if (fullName) {
    user.fullName = fullName;
  }

  // Run only if user sends a file
  if (req.file) {
    // Deletes the old image uploaded by the user
    await cloudinary.v2.uploader.destroy(user.avatar.public_id);

    try {
      const result = await cloudinary.v2.uploader.upload(req.file.path, {
        folder: 'lms', // Save files in a folder named lms
        width: 250,
        height: 250,
        gravity: 'faces', // This option tells cloudinary to center the image around detected faces (if any) after cropping or resizing the original image
        crop: 'fill',
      });

      // If success
      if (result) {
        // Set the public_id and secure_url in DB
        user.avatar.public_id = result.public_id;
        user.avatar.secure_url = result.secure_url;

        // After successful upload remove the file from local storage
        fs.rm(`uploads/${req.file.filename}`);
      }
    } catch (error) {
      return next(
        new AppError(error || 'File not uploaded, please try again', 400)
      );
    }
  }

  // Save the user object
  await user.save();

  res.status(200).json({
    success: true,
    message: 'User details updated successfully',
  });
};

export {
  login,logout,register,getprofile,forgotPassword,resetPassword,changePassord,updateUser,
};