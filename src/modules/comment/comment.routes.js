import { Router } from "express";
import * as CC from "./comment.controller.js"
import { auth } from "../../middlewares/auth.middleware.js";
import { multermiddle } from "../../middlewares/multerMiddle.js";
import expressAsyncHandler from "express-async-handler";
import { allowedExtensions } from "../../utils/allowedExtensions.js";


const router = Router()



router.post('/:productId',auth(),expressAsyncHandler(CC.addComment))






export default router