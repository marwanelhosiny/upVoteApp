
import joi from "joi"
import { Types } from "mongoose"

export const objectidValidation=(value,helper)=>{
    const isValid= Types.ObjectId.isValid(value)
    return( isValid? value : helper.message('invalid objectId'))
}

export const signupSchema={
    body:joi.object({
        username:joi.string().required(),
        email:joi.string().email().required(),
        password:joi.string().required(),
        gender:joi.string().valid('male','female').required(),
        age:joi.number().max(100).min(15).required()
    }),

}


export const signinSchema={
    body:joi.object({
        email:joi.string().email().required(),
        password:joi.string().required(),
    }),

}


export const likesSchema={
    params:joi.object({
        _id:joi.string().custom(objectidValidation).required()
    }),

}