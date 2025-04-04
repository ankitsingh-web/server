import {model,Schema}from 'mongoose'

const courseSchema=new Schema({
  title:{
    type :String,
    required:[true,'title is required'],
    minLength:[8,'title must be at least 8 charecter'],
    maxLength:[59,'title should be less than 60 charecters'],
    trim:true,
  },
  description:{
    type:String,
    required:[true,'Description is required'],
    minLength:[8,'title must be at least 8 charecter'],
    maxLength:[200,'title should be less than 200 charecters'],
    trim:true,
    
  },
  category:{
    type: String,
    required:[true],
  },
  thumbnail:{
    public_id:{
      type :String,
      required:[true],
    },
    secure_url:{
      type:String,
      required:[true],
    }
  },
  lectures:[
    {
    title:String,
    description:String,
    
    lecture:{
      public_id:{
        type :String,
       
      },
      secure_url:{
        type:String,
    
      }
    }}
  ],
  numberOfLecture:{
    type:Number,
    default:0,
  //  required:[true],
  },
  createdBy:{
    type:String
    , required:[true],
  },
  
},{timestamps:true});
const Course=model('course',courseSchema);
export default Course;