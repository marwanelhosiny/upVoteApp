import User from "../../../DB/models/user.model.js";
import bcrypt from "bcryptjs"
import jwt from"jsonwebtoken"
import cloudinaryConnection from "../../utils/cloudinary.js";
import axios from "axios";


export const signUp=async(req,res,next)=>{
    const{username,email,password,gender,age}=req.body
    const isExist = await User.findOne({email})
    if(isExist){return next(new Error('duplicated email',{cause:400}))}
    const hashedPass=bcrypt.hashSync(password,9)
    const addUser= await User.create({username,email,password:hashedPass,gender,age})
    axios({
        method : "post",
        url: "http://localhost:3000/user/login",
        data:{email,password},
    }).then((response)=>{return res.status(201).json({message:'user registered successfully',addUser,response:response.data})}
    )
    .catch((err)=>{err.data})
}

export const signIn =async(req,res,next)=>{
    const{email,password}=req.body
    const isExist = await User.findOne({email})
    if(!isExist){return next(new Error('invalid credentials',{cause:400}))}
    const checkPass=bcrypt.compareSync(password,isExist.password)
    if(!checkPass){return next(new Error('invalid credentials',{cause:400}))}
    const{username,_id}=isExist
    const token =  jwt.sign({email,username,_id},"secretKey",{expiresIn:"1h"})
    return res.status(200).json({message:"you signed in successfully",token})
}

export const changePass= async(req,res,next)=>{
    const{newPass,oldPass}=req.body
    const{_id}=req.authUser
    const checkPass=bcrypt.compareSync(oldPass,req.authUser.password)
    if(!checkPass){return next(new Error('invalid credentials',{cause:400}))}
    const hashedPass=bcrypt.hashSync(newPass,9)
    const passUpdate= await User.updateOne({_id},{password:hashedPass})
    if(!passUpdate.modifiedCount){return next(new Error('update failed',{cause:400}))}
    res.status(200).json({message:"password updated Successfully",passUpdate})
}

export const profilePic=async(req,res,next)=>{
    const {_id} =req.authUser
    if(!req.file){return next(new Error('no pic selected',{cause:400}))}
    const {secure_url,public_id} =await cloudinaryConnection().uploader.upload(req.file.path,{
        folder:`upVoteImages/user/${_id}/profilePic`
    })
    const addPic= await User.findOneAndUpdate({_id},{profilePic:{secure_url,public_id}})
    if(!addPic){return next(new Error('invalid file',{cause:400}))}
    return res.json({message:'pic updated',addPic})
}


//==================================likes History================================//

export const likes=async(req,res,next)=>{
    const{_id}=req.params
    const likeHistory= await User.findById(_id).populate('likes').exec()
    return res.status(200).json({message:'likeHistory',likeHistory})
}