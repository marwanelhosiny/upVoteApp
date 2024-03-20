import jwt from "jsonwebtoken"
import User from "../../DB/models/user.model.js"

export const auth=(accessRoles=['user','admin'])=>{
    return async(req,res,next)=>{
        try{const{accesstoken}=req.headers
        if(!accesstoken){return next(new Error('missing access token',{cause:400}))}
        const prefix= accesstoken.startsWith('xDfeDp')
        if(!prefix){return next(new Error('invalid token',{cause:400}))}
        const token= accesstoken.slice(6)
        const verifiedToken= jwt.verify(token,'secretKey')
        if(!verifiedToken || !verifiedToken._id){return next(new Error('invalid token payload',{cause:400}))}
        const stillExist= await User.findById({_id:verifiedToken._id})
        if(!stillExist){return next(new Error('please signUp first',{cause:400}))}
        //authorization check
        if(!accessRoles?.includes(stillExist.Role)){return next(new Error('you are not allowed to access this URL',{cause:400}))}
        req.authUser=stillExist
        next()}catch(error){next(new Error(`authentication error :${error.message}`,{casue:400}))}
    }
}