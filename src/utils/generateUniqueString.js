import { customAlphabet, nanoid } from "nanoid"


const generateUniequeString=(len)=>{
    const nanoid=customAlphabet('abcdefghijk',len)
    return nanoid()
}

export default generateUniequeString