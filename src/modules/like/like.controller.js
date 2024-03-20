import Comment from "../../../DB/models/comment.model.js";
import Like from "../../../DB/models/likes.model.js";
import Product from "../../../DB/models/product.model.js";
import Reply from "../../../DB/models/reply.model.js";

export const like=async(req,res,next)=>{
    const{_id}=req.authUser
    const{documentId}=req.params
    const{onModel}=req.body
    console.log(onModel)
    let dbModel;
    if(onModel==="product") dbModel=Product
    if(onModel==="comment") dbModel=Comment
    if(onModel==="reply") dbModel=Reply
    

    const document= await dbModel.findById(documentId)
    if(!document){return next(new Error(`${onModel} doesn't exist`,{cause:400}))}
    const isLiked =await Like.findOne({likedBy:_id,likeDoneOn:documentId})
    if(isLiked){
        const disLike = await Like.findByIdAndDelete(isLiked._id)
        document.numberOfLikes--
        document.save()
        return res.status(200).json({message:`you disliked this ${onModel}`})
    }
    const like= await Like.create({likedBy:_id,likeDoneOn:documentId,onModel})
    document.numberOfLikes++
    await document.save()
    return res.status(200).json({message:`you liked this ${onModel}`})
}