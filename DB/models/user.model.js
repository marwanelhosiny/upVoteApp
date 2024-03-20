import { Schema, model } from "mongoose";



const userSchema = Schema({
    username:{
        type:String,
        required:true,
        lowercase:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true
    },
    password:{
        type:String,
        required:true
    },
    isConfirmed:{
        type:Boolean,
        default:false
    },
    gender:{
        type:String,
        enum:['male','female'],
        default:'male'
    },
    age:{
        type:Number,
        min:15,
        max:100
    },
    profilePic:{
        secure_url:{type:String},
        public_id:{type:String}
    },
    Role:{
        type:String,
        enum:['user','admin'],
        default:'user'
    }
},{timestamps:true})

userSchema.set('toObject',{virtuals:true})
userSchema.set('toJSON',{virtuals:true})

userSchema.virtual('likes',{
    ref:'like',
    localField:'_id',
    foreignField:'likedBy'
})

const User =model('user',userSchema)


export default User