import { Router } from "express";
import * as PC from "./product.controller.js"
import { auth } from "../../middlewares/auth.middleware.js";
import { multermiddle } from "../../middlewares/multerMiddle.js";
import expressAsyncHandler from "express-async-handler";
import { allowedExtensions } from "../../utils/allowedExtensions.js";
import { endPointsRoles } from "./product.endpoints.roles.js";


const router = Router()


router.post('/',auth(),multermiddle(allowedExtensions.Image).array('image',4),expressAsyncHandler(PC.addProduct))
router.get('/like/:productId',auth(),expressAsyncHandler(PC.likeProduct))
router.put('/',auth(),multermiddle(allowedExtensions.Image).single('image'),expressAsyncHandler(PC.updateProduct))
router.delete('/:productId',auth(),expressAsyncHandler(PC.deleteProduct))
router.get('/',expressAsyncHandler(PC.getAllProductsWithTheirComments))
router.delete('/banProduct/:productId',auth(endPointsRoles.banProduct),expressAsyncHandler(PC.banProduct))








export default router