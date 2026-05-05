import jwt from "jsonwebtoken"


// creating token from userid

const genToken= async (userID)=>{
 try {
   const token=jwt.sign({userID},process.env.JWT_SECRET,{expiresIn:"7d"})
 return token
 } catch (error) {
   console.log(error);
 }
}

export default genToken
