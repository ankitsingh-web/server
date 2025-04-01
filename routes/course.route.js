import {Router} from 'express'
import { createCourse, getAllcourses, getLecturesByCourseId, updateCourse ,removeCourse,addLectureToCourseById,removeLectureFromCourse} from '../controllers/course.controller.js';
import upload from '../middleware/multer.middleware.js';
import { authorizedRoles, isLoggedIn } from '../middleware/auth.middleware.js';
//import { authorizedRoles, isLoggedIn } from '../middleware/auth.middleware.js';


const router =Router();

router.route('/')
.get(getAllcourses)
.post(isLoggedIn,authorizedRoles('ADMIN'),upload.single("thumbnail"),createCourse)
.delete(isLoggedIn, authorizedRoles('ADMIN'), removeLectureFromCourse);
router.route('/:id')
.get(isLoggedIn,getLecturesByCourseId)
.put(isLoggedIn,authorizedRoles('ADMIN'),updateCourse)
.delete(isLoggedIn,authorizedRoles('ADMIN'),removeCourse)
.post(isLoggedIn,authorizedRoles('ADMIN'),upload.single('lecture'),addLectureToCourseById);
export default router;