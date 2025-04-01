import { Router } from "express";
import { getprofile, login, logout, register,forgotPassword ,resetPassword, changePassord } from "../controllers/user.controller.js";
import{ isLoggedIn } from "../middleware/auth.middleware.js";
import upload from "../middleware/multer.middleware.js";
import { updateUser } from "../controllers/user.controller.js";
const router=Router();

router.post('/register',upload.single("avatar"),register);
router.post('/login',login);
router.post('/logout',logout);
router.get('/me',isLoggedIn,getprofile);
router.post('/reset',forgotPassword)
router.post('/reset/:resetToken',resetPassword);
router.post('/change-password',isLoggedIn,changePassord);
router.put("/update/:id", isLoggedIn, upload.single("avatar"), updateUser);
export default router;