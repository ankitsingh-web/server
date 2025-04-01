import { Schema,model } from "mongoose";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'



const userSchema=new Schema({
  

fullName:{
  type:'String',
  required:[true,'name is required'],
  minLength:[5,'name must be at least 5 character'],
  lowercase:true,
  trim :true, //extra space remove that is not save in data base 
},
email:{
  type:'String',
  required:[true,'Email is require'],
  lowercase:true,
  trim:true,
  unique:true,
  match:[/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Please enter a valid email address']

  
},
password:{
  type:'String',
  required:[true,'password is required'],
  minLength:[8,'password must be at least 8 charecter'],
  select:false,
},
avatar:{
  public_id:{
    type:'String'
  },
  secure_url:{
    type:'string'
  }
},
role:{
type:'String',
enum:['USER','ADMIN'],
default:'USER'
},
forgetPasswordToken:String,
forgetPassordExpiary:Date,
subscription:{
  id:String,
  status:String 
}
},
{timestamps:true//when any operation is perform it will manage no need to dife explicitly
},
);

userSchema.pre('save',async function(next){
  if(!this.isModified('password')){
    return next();
  }
this.password=await bcrypt.hash(this.password,10);
})

userSchema.methods={
  generateJWTToken:async function(){

    return await jwt.sign({id:this._id,
      email: this.email,subscription:this.subscription,role:this.role}
      , "SECRET",
      { expiresIn: "1h" }
  )},
  comparePassord:async function(plainTextPassword){
return await bcrypt.compare(plainTextPassword,this.password);
  },
  genratePasswordResetToken:async function(){
const resetToken=crypto.randomBytes(20).toString('hex');

this.forgetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
//we difine directly resetToken to forgetPasswordToken but this can not do becuse it store in database  
this.forgetPassordExpiary=Date.now() + 15*60*1000;

return resetToken;
  }
}

const User = model ('User',userSchema);

export default User;
