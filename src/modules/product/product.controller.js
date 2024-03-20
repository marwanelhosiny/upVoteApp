import Comment from "../../../DB/models/comment.model.js";
import Like from "../../../DB/models/likes.model.js";
import Product from "../../../DB/models/product.model.js";
import cloudinaryConnection from "../../utils/cloudinary.js";
import generateUniequeString from "../../utils/generateUniqueString.js";



export const addProduct=async(req,res,next)=>{
    const{title,caption}=req.body
    const{_id}=req.authUser
    console.log(req.files)
    if(!req.files?.length){return next(new Error('you must upload one pic at least',{cause:400}))}
    const folderId =generateUniequeString(6)
    let images=[]
    for(const file of req.files){
        const {secure_url,public_id}=await cloudinaryConnection().uploader.upload(file.path,{
            folder:`upVoteImages/products/${_id}/${folderId}`
        })
        images.push({secure_url,public_id,folderId})
    }
    const product = await Product.create({title,addedBy:_id,images})
    if(!product){
        const delfiles = await cloudinaryConnection().api.delete_resources_by_prefix(`upVoteImages/products/${_id}/${folderId}`)
        const delfolder = await cloudinaryConnection().api.delete_folder(`upVoteImages/products/${_id}/${folderId}`)
        return next(new Error('please try again',{cause:400}))}
    return res.status(201).json({message:'product added successfully',product})
}

export const likeProduct=async(req,res,next)=>{
    const{_id}=req.authUser
    const{productId}=req.params
    const{onModel}=req.body
    const product= await Product.findById(productId)
    if(!product){return next(new Error("product doesn't exist",{cause:400}))}
    const isLiked =await Like.findOne({likedBy:_id,likeDoneOn:productId})
    if(isLiked){
        const disLike = await Like.findByIdAndDelete(isLiked._id)
        product.numberOfLikes--
        product.save()
        return res.status(200).json({message:"you disliked this product"})
    }
    const like= await Like.create({likedBy:_id,likeDoneOn:productId,onModel})
    product.numberOfLikes++
    await product.save()
    return res.status(200).json({message:"you liked this product"})
}

export const updateProduct=async(req,res,next)=>{
    const{title,caption,oldPublicId,productId}=req.body
    const{_id}=req.authUser
    //check product existance
    const product=await Product.findOne({_id:productId,addedBy:_id})
    if(!product){return next(new Error("product doesn't exist",{cause:400}))}
    if(title){
        product.title=title
    }
    if(caption){
        product.caption=caption
    }
    //check if there new files to upload
    if(!req.file){return next(new Error("missing expected files",{cause:400}))}
    // delete image from cloudinary
    const delImages= await cloudinaryConnection().uploader.destroy(oldPublicId)
    // update image on cloudinary
    const {public_id,secure_url}=await cloudinaryConnection().uploader.upload(req.file.path,{
        folder:`upVoteImages/products/${_id}/${product.images[0].folderId}`
    })
    for(const image of product.images){
        if(image.public_id==oldPublicId){
            image.public_id=public_id
            image.secure_url=secure_url
        }
    }
    await product.save()
    return res.status(200).json({message:"product updated successfully"})
}

export const deleteProduct=async(req,res,next)=>{
    const{productId}=req.params
    const{_id}=req.authUser
    const product=await Product.findOne({_id:productId,addedBy:_id})
    if(!product){return next(new Error("product doesn't exist",{cause:400}))}
    //remove product images from host
    const delImages=await cloudinaryConnection().api.delete_resources_by_prefix(`upVoteImages/products/${_id}/${product.images[0].folderId}`)
    .catch((error)=>{return next(new Error(error.message,{cause:400}))})
    //remove product folder from host
    const delFolder=await cloudinaryConnection().api.delete_folder(`upVoteImages/products/${_id}/${product.images[0].folderId}`)
    .catch((error)=>{return next(new Error(error.message,{cause:400}))})
    //delete product from db
    const deleteProduct=await Product.deleteOne({_id:productId})
    return res.status(200).json({message:"product deleted successfully"})

}

//======================================= getAllProductsWithTheirComments======================================//

//an api gets data from comments (child) to product (parent)

// using lean
/* export const getAllProductsWithTheirComments=async(req,res,next)=>{
    const products= await Product.find().lean()
    for(const product of products){
        const comments=await Comment.find({productId:product._id})
        product.comments=comments
    }
    return res.status(200).json({message:'products',products})
} */

// using cursor
/* export const getAllProductsWithTheirComments=async(req,res,next)=>{
    const products= await Product.find().cursor()
    let productsArr=[]
    for(let doc=await products.next();doc!=null;doc=await products.next()){
        const comments=await Comment.find({productId:doc._id})
        const docObj=doc.toObject()
        docObj.comments=comments
        productsArr.push(docObj)
    }
    return res.status(200).json({message:'products',productsArr})
}
 */

//using virtual property and populate
export const getAllProductsWithTheirComments=async(req,res,next)=>{
    const products = await Product.find().populate('comments').exec();
    return res.status(200).json({message:'products',products})
}


//========================================== banProduct========================//

export const banProduct=async(req,res,next)=>{
    const{productId}=req.params
    const {_id}=req.authUser
    const product=await Product.findById(productId)
    if(!product){return next(new Error("product doesn't exist",{cause:400}))}
    //remove product images from host
    const delImages=await cloudinaryConnection().api.delete_resources_by_prefix(`upVoteImages/products/${_id}/${product.images[0].folderId}`)
    .catch((error)=>{return next(new Error(error.message,{cause:400}))})
    //remove product folder from host
    const delFolder=await cloudinaryConnection().api.delete_folder(`upVoteImages/products/${_id}/${product.images[0].folderId}`)
    .catch((error)=>{return next(new Error(error.message,{cause:400}))})
    //delete product from db
    const deleteProduct=await Product.deleteOne({_id:productId})
    return res.status(200).json({message:"product deleted successfully"})

}