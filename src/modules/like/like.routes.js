import { Router } from "express";
import * as LC from "./like.controller.js"
import { auth } from "../../middlewares/auth.middleware.js";
import expressAsyncHandler from "express-async-handler";
import { allowedExtensions } from "../../utils/allowedExtensions.js";


const router = Router()



router.post('/:documentId',auth(),expressAsyncHandler(LC.like))






export default router