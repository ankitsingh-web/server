import Course from "../models/course.model.js";
import fs from 'fs/promises'
import cloudinary from 'cloudinary';
import AppError from "../utills/error.utills.js";
const getAllcourses=async function(req,res,next){
const courses=await Course.find({}).select('-lectures');

try{
  res.status(200).json({
    success:true,
    message:'All Courses',
  courses,
  })
}
catch(e){
return next(new AppError(`${e.message}  ->email or password does not match`,400));
}



}
const getLecturesByCourseId=async function(req,res,next){
try{
const {id}=req.params;
const course =await Course.findById(id);
if(!course){
  return next(new AppError(`course not found`,400));
}
res.status(200).json({
  success:true,
  message:'lecture fetches successfully',
  lectures:course.lectures,
})
}
catch(e){
  return next(new AppError(`${e.message}  `,400));
}
}
const createCourse =async (req,res,next)=>{
 
const {title,description,category,createdBy}=req.body;
if(!title || !description || !category || !createdBy ){
  return next(new AppError(`every data is required`,400));
}

const course=await Course.create({
  title,
  description,
  category,
  createdBy,
  thumbnail:{
    public_id:'Dummy',
    secure_url:'Dummy_url',
  },
})
if(!course){
  return next(new AppError(`course not created`,400));
}
//console.log(`file path is -> ${req.file.path}`)
try{
if(req.file){
  const result=await cloudinary.v2.uploader.upload(req.file.path,{
    folder:'lms'
  });
  if(result){
    console.log(result);
    course.thumbnail.public_id=result.public_id;
    course.thumbnail.secure_url=result.secure_url;
  
  const filePath='C:/Users/ankit/OneDrive/Documents/server/uploads/rajan.jpg'
  fs.rm(filePath, {force:true});
}
  //fs.rm(`uploads/${req.file.fileName}`); 
}
await course.save();
}
catch(e){
  return next(new AppError(`${e.message} -> course not created`,400));
}
res.status(200).json({
  success:true,
  message: 'Course created successfully',
  course,
})

}
const updateCourse=async(req,res,next)=>{
try{
const {id}=req.params;
const course=await Course.findByIdAndUpdate(id,
  {
    $set:req.body
  },{
    runValidators:true
  });
  if(!course){
    return  next(new AppError(`${e.message} -> course with given id is not exist`,400));
  }
  res.status(200).json({
    success:true,
    message:'course updated successfully',
    course,
  })
}catch(e){
  return next(new AppError(`${e.message} -> course is not update`,400));
}
}
const removeCourse=async (req,res,next)=>{
try{
const {id}=req.params;
const course=await Course.findById(id);
if(!course){
  return  next(new AppError(`${e.message} -> course with given id is not exist`,400));
}
await Course.findByIdAndDelete(id);

res.status(200).json({
  success:true,
  message:'course removed successfully',
  course,
})
}
catch(e){
  return next(new AppError(`${e.message} -> course is not removed`,400));
}
}
const addLectureToCourseById=async(req,res,next)=>{
const {title,description}=req.body;
console.log(title,"hi->>>>>",description);
if(!title || !description ){
  return next(new AppError(`every data is required`,400));
}
const {id}=req.params;
const course=await Course.findById(id);
if(!course){
  return  next(new AppError(`${e.message} -> course with given id is not exist`,400));
}
const lectureData={
  title,description,lecture:{},
};

  
if(req.file){
  try{
    const result=await cloudinary.v2.uploader.upload(req.file.path,{
      folder:'lms',
      chunk_size: 50000000, // 50 mb size
        resource_type: 'video',
    });
    if(result){
     // console.log(result);
     lectureData.lecture.public_id=result.public_id;
     lectureData.lecture.secure_url=result.secure_url;
    
    //const filePath='C:/Users/ankit/OneDrive/Documents/server/uploads/rajan.jpg'
    fs.rm(req.file.path, { force: true }, (err) => {
      if (err) console.error('File deletion error:', err);
    });
    
  }
  }
catch(e){
return next(new AppError(e.message,500));
}
course.lectures.push(lectureData);
course.numberOfLecture=course.lectures.length;
await course.save();
res.status(200).json({
  success:true,
  message:'Lecture successfully added to course',
  course
})
}

}
const removeLectureFromCourse =async (req, res, next) => {
  // Grabbing the courseId and lectureId from req.query
  const { courseId, lectureId } = req.query;

 // console.log(courseId);

  // Checking if both courseId and lectureId are present
  if (!courseId) {
    return next(new AppError('Course ID is required', 400));
  }

  if (!lectureId) {
    return next(new AppError('Lecture ID is required', 400));
  }

  // Find the course uding the courseId
  const course = await Course.findById(courseId);

  // If no course send custom message
  if (!course) {
    return next(new AppError('Invalid ID or Course does not exist.', 404));
  }

  // Find the index of the lecture using the lectureId
  const lectureIndex = course.lectures.findIndex(
    (lecture) => lecture._id.toString() === lectureId.toString()
  );

  // If returned index is -1 then send error as mentioned below
  if (lectureIndex === -1) {
    return next(new AppError('Lecture does not exist.', 404));
  }

  // Delete the lecture from cloudinary
  await cloudinary.v2.uploader.destroy(
    course.lectures[lectureIndex].lecture.public_id,
    {
      resource_type: 'video',
    }
  );

  // Remove the lecture from the array
  course.lectures.splice(lectureIndex, 1);

  // update the number of lectures based on lectres array length
  course.numberOfLecture = course.lectures.length;

  // Save the course object
  await course.save();

  // Return response
  res.status(200).json({
    success: true,
    message: 'Course lecture removed successfully',
  });
};

export {getAllcourses,getLecturesByCourseId,createCourse,updateCourse, removeCourse,addLectureToCourseById,removeLectureFromCourse};