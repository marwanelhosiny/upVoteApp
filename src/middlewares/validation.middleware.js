

export const validationFunction =(schema)=>{
    const reqKeys=['body','query','headers','params']
    return (req,res,next)=>{
        let validationErrors=[]
        for (const Key of reqKeys) {
            const validationResult=schema[Key]?.validate(req[Key],{abortEarly:false})
            if(validationResult?.error){
                validationErrors.push(...validationResult.error.details)
            }
        }
        if(validationErrors.length){
        res.json({message:"valdation errors",errors:validationErrors.map((ele)=>{return ele.message})})
        }
        next()
    }
}