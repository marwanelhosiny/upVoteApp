import mongoose from "mongoose";


const db_connection= async()=>{
    await mongoose.connect('mongodb://127.0.0.1:27017/upVote')
    .then(()=>{console.log('db connected successfully')})
    .catch((err)=>{console.log("connection failed",err)})
}


export default db_connection