import mongoose from "mongoose";

mongoose.set ('strictQuery',false);
const connectionToDB=async()=>{
  try{
<<<<<<< HEAD
  
  const {connection}=await mongoose.connect(process.env.MONGO_URL)
=======
   
  const {connection}=await mongoose.connect(process.env.MONGO_URL||'mongodb://localhost:27017/lms')
>>>>>>> 01ab88723d712d2cc8624ffc19af014a1cffc9f8

if(connection){
  console.log(`connect to MongoDB "${connection.host}"`);
}}
catch(e){
  console.error(e);
  process.exit(1);//all the process kill out
}
}
export default connectionToDB;
