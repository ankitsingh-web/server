import mongoose from "mongoose";

mongoose.set ('strictQuery',false);
const connectionToDB=async()=>{
  try{
    console(process.env.MONGO_URL)
  const {connection}=await mongoose.connect(process.env.MONGO_URL||'mongodb://localhost:27017/lms')

if(connection){
  console.log(`connect to MongoDB "${connection.host}"`);
}}
catch(e){
  console.log(e);
  process.exit(1);//all the process kill out
}
}
export default connectionToDB;