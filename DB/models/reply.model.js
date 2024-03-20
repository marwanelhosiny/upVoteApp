import { Schema, model } from "mongoose";


const replySchema= new Schema({
    addedBy:{
        type:Schema.Types.ObjectId,
        required:true,
        ref:'user'
    },
    replyOn:{
        type:Schema.Types.ObjectId,
        required:true,
        ref:"comment"
    },
    numberOfLikes:{
        type:Number,
        default:0,
        min:0
    }

},{timestamps:true})

const Reply=model('reply',replySchema)


export default Reply