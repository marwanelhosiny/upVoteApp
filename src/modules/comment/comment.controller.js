import Comment from "../../../DB/models/comment.model.js";
import Product from "../../../DB/models/product.model.js";



//============================ add comment ========================//

export const addComment=async(req,res,next)=>{
    const {content}=req.body
    const {productId}=req.params
    const {_id}=req.authUser

    //check product existance
    const product= await Product.findById(productId)
    if(!product){return next(new Error('product does not found'))}
    const comment= await Comment.create({addedBy:_id,productId,content})
    return res.status(201).json({message:"your comment sent successfully",comment})
}