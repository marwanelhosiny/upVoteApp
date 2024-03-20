import { Router } from "express";
import * as uc from "./user.controller.js"
import expressAsyncHandler from "express-async-handler";
import { auth } from "../../middlewares/auth.middleware.js";
import { validationFunction } from "../../middlewares/validation.middleware.js";
import { likesSchema, signinSchema, signupSchema } from "./user.schemas.js";
import { multermiddle } from "../../middlewares/multerMiddle.js";
import { allowedExtensions } from "../../utils/allowedExtensions.js";
const router = Router()



router.post('/',validationFunction(signupSchema),expressAsyncHandler(uc.signUp))
router.post('/login',validationFunction(signinSchema),expressAsyncHandler(uc.signIn))
router.patch('/',auth(),expressAsyncHandler(uc.changePass))
router.post('/upload',multermiddle(allowedExtensions.Image).single('image'),auth(),expressAsyncHandler(uc.profilePic))
router.get('/likes/:_id',validationFunction(likesSchema),auth(),expressAsyncHandler(uc.likes))













export default router