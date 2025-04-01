import User from "../models/user.model.js";
import { razorpay } from "../server.js";
import AppError from "../utills/error.utills.js";
import crypto from 'crypto'
import { createPlan } from "../server.js";
import Payment from "../models/payment.model.js";
export const getRazorpayApiKey=async(req,res,next)=>{

  res.status(200).json({
    success:true,
    message:'Razorpay API Key',
    key : "rzp_test_GNs9Ncqmke6WDK",
  })
}
// export const buySubscription=async(req,res,next)=>{
  
//   const {id}=req.user;
//   console.log();
//   const user=await User.findById(id);
//   if(!user){
//     return next(AppError('unauthorized , please login',400))
//   }
//   if(user.role==='ADMIN'){
//     return next(AppError('Admin cannot purchase subscription',400));
//   }
//   console.log("skaxioaxduserDetails");
//   const subscription=await razorpay.subscriptions.create({
//     plan_id:"test_plan_id_123ef",
//     customer_notify:1,
//   });
//   console.log(subscription);
//   console.log("name of the ",subscription)
//   user.subscription.id=subscription.id;
//   user.subscription.status=subscription.status;

//   await user.save();
//   res.status(200).json({
//   success:true,
//   message:'subscribed successfully',
//   subscription_id:subscription.id,
// })

// }
export const buySubscription = async (req, res, next) => {
  try {
    const { id } = req.user;
    const user = await User.findById(id);

    if (!user) {
      return next(new AppError('Unauthorized, please login', 400));
    }

    if (user.role === 'ADMIN') {
      return next(new AppError('Admin cannot purchase subscription', 400));
    }

    // Create the plan and get the plan_id
    const plan_id = await createPlan(); // This is where the plan is created

    const subscription = await razorpay.subscriptions.create({
      plan_id: plan_id, // Use the dynamically created plan_id
      customer_notify: 1,
      total_count: 12,
    });

    user.subscription.id = subscription.id;
    user.subscription.status = subscription.status;

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Subscribed successfully',
      subscription_id: subscription.id,
    });
  } catch (error) {
    console.error('Error in buying subscription:', error);
    return next(new AppError('Failed to create subscription', 500));
  }
};

export const verifySubsciption=async(req,res,next)=>{
  const {id}=req.user;
  const {razorPay_payment_id,razorPay_signature,razorPay_subscription_id}=req.body;
  const user=await User.findById(id);
  if(!user){
    return next(new AppError('unauthorized , please login',400))
  }
const subscriptionId=user.subscription.id;
console.log("req",req.body);
const genratedSignature=crypto.createHmac('sha256',"ajYH99ZRQrJRmJTWxu430OmR").update(`${razorPay_payment_id}|${subscriptionId}`).digest('hex');
console.log("->",genratedSignature,razorPay_signature,"->")
if(genratedSignature!==razorPay_signature){
  return next(new AppError('Payment not verified , please try again',500));
}
await Payment.create({
  razorPay_signature,
  razorPay_payment_id,
  razorPay_subscription_id
})
user.subscription.status='active';
await user.save();

res.status(200).json({
  success:true,
  message:'payment verified successfully',
  
})
}

export const cancelSubscription=async(req,res,next)=>{
try { const {id }=req.user;
  const user = await User.findById(id);
  if(!user){
    return next(new AppError('unauthorized , please login',400))
  }
  if(user.role==='ADMIN'){
    return next(new AppError('Admin cannot cancel subscription',400));
  }
const subscriptionId=user.subscription.id;
const subscription=await razorpay.subscriptions.cancel(subscriptionId);
user.subscription.status=subscription.status;
await user.save();}
catch(e){
  return next(new AppError(e.message,400));
}
}

export const allPayment=async(req,res,next)=>{
  const {count,skip}=req.query;
    // Find all subscriptions from razorpay
    const allPayments = await razorpay.subscriptions.all({
      count: count ? count : 10, // If count is sent then use that else default to 10
      skip: skip ? skip : 0,  // If skip is sent then use that else default to 0
    });
  
    const monthNames = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
  
    const finalMonths = {
      January: 0,
      February: 0,
      March: 0,
      April: 0,
      May: 0,
      June: 0,
      July: 0,
      August: 0,
      September: 0,
      October: 0,
      November: 0,
      December: 0,
    };
  
    const monthlyWisePayments = allPayments.items.map((payment) => {
      // We are using payment.start_at which is in unix time, so we are converting it to Human readable format using Date()
      const monthsInNumbers = new Date(payment.start_at * 1000);
  
      return monthNames[monthsInNumbers.getMonth()];
    });
  
    monthlyWisePayments.map((month) => {
      Object.keys(finalMonths).forEach((objMonth) => {
        if (month === objMonth) {
          finalMonths[month] += 1;
        }
      });
    });
  
    const monthlySalesRecord = [];
  
    Object.keys(finalMonths).forEach((monthName) => {
      monthlySalesRecord.push(finalMonths[monthName]);
    });
  
    res.status(200).json({
      success: true,
      message: 'All payments',
      allPayments,
      finalMonths,
      monthlySalesRecord,
    });
  };

