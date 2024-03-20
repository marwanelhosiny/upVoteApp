import { Schema, model } from "mongoose";

String

const likeSchema = Schema({
    likedBy:{
        type:Schema.Types.ObjectId,
        ref:'user'
    },
    likeDoneOn:{
        type:Schema.Types.ObjectId,
        refPath:'onModel'
    },
    onModel:{
        type:String,
        enum:['product','comment','reply']
    }
},{timestamps:true})

const Like =model('like',likeSchema)


export default Like