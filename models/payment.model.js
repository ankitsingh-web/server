import {model,Schema} from 'mongoose';
const paymentShema=new Schema({
  razorPay_signature :{
    type:String,
    required:true
  },
  razorPay_subscription_id :{
    type:String,
    required:true,
  },
  razorPay_payment_id:{
    type:String,
  }
},{timestamps:true});

const Payment = model('payment',paymentShema);
export default Payment;