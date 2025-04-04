
import User from '../models/user.model.js';
// import AppError from '../utils/AppError.js';
import AppError from '../utills/error.utills.js';
// import sendEmail from '../utils/sendEmail.js';
import sendEmail from '../utills/sendemail.js';

export const contactUs = async (req, res, next) => {
 
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return next(new AppError('Name, Email, Message are required'));
  }

  try {
    const subject = 'Contact Us Form';
   // const textMessage = `${name} - ${email} <br /> ${message}`;
   const textMessage ={
    name,email,message
   }
  //console.log(process.env.CONTACT_US_EMAIL, subject, textMessage);
    await sendEmail(textMessage);
  } catch (error) {
    console.log(error);
    return next(new AppError(error.message, 400));
  }

  res.status(200).json({
    success: true,
    message: 'Your request has been submitted successfully',
  });
};


export const userStats = async (req, res, next) => {
  const allUsersCount = await User.countDocuments();

  const subscribedUsersCount = await User.countDocuments({
    'subscription.status': 'active', // subscription.status means we are going inside an object and we have to put this in quotes
  });

  res.status(200).json({
    success: true,
    message: 'All registered users count',
    allUsersCount,
    subscribedUsersCount,
  });}
;