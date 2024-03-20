import  { Schema, model } from "mongoose";


const productSchema= Schema({
    title:{
        type:String,
        required:true
    },
    caption:{
        type:String,
        default:'no caption'
    },
    images:[{
        secure_url:{type:String,required:true},
        public_id:{type:String,required:true},
        folderId:{type:String,required:true}
    }],
    addedBy:{
        type:Schema.Types.ObjectId,
        ref:'user',
        required:true
    },
    numberOfLikes:{
        type:Number,
        default:0,
        min:0
    }
},{timestamps:true})

productSchema.set('toObject',{virtuals:true})
productSchema.set('toJSON',{virtuals:true})

productSchema.virtual('comments',{
    ref:'comment',
    localField:'_id',
    foreignField:'productId'
})

const Product = model('product',productSchema)

export default Product