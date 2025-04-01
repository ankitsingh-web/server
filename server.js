
import { config } from "dotenv";
config();
const port=process.env.PORT||5200;
console.log(process.env.PORT)
import cloudinary from 'cloudinary'
import app from "./app.js";
import connectionToDB from "./config/bdconnection.js";
import Razorpay from 'razorpay';
cloudinary.v2.config({
  cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
  api_key:process.env.CLOUDINARY_API_KEY,
  api_secret:process.env.CLOUDINARY_API_SECRET
});

export const razorpay=new Razorpay({
  key_id:"rzp_test_GNs9Ncqmke6WDK",
  key_secret:"ajYH99ZRQrJRmJTWxu430OmR",
});
export const createPlan = async () => {
  try {
    const plan = await razorpay.plans.create({
      period: "monthly", // or "yearly", "weekly", etc.
      interval: 1, // Frequency of the billing cycle
      item: {
        name: "Basic Plan", // Name of the plan
        description: "Monthly subscription to Basic Plan", // Plan description
        amount: 100, // Amount in paise (e.g., 50000 paise = 500 INR)
        currency: "INR", // Currency code
      },
    });

    console.log("Plan created successfully:", plan);
    return plan.id; // Return the plan_id for further use
  } catch (error) {
    console.error("Error creating plan:", error);
    throw new Error("Failed to create plan");
  }
};

app.listen(port,async()=>{
await connectionToDB();
console.log(`successfully run on port no. "${port}"`);
})