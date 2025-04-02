import mongoose from "mongoose";

mongoose.set ('strictQuery',false);
const connectionToDB=async()=>{
  try{

  
  const {connection}=await mongoose.connect(process.env.MONGO_URL)


if(connection){
  console.log(`connect to MongoDB "${connection.host}"`);
}}
catch(e){
  console.error(e);
  process.exit(1);//all the process kill out
}
}
export default connectionToDB;
