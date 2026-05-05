
import genToken from "../config/token.js"
import User from "../models/userModel.js"


// data fetch from frontened


export const googleAuth=async (req,res)=>{
  try {
    // fetch name and email from req body frontend
  const {name,email}=req.body
  // looking for user is already in DB or not
  let user= await User.findOne({email})
  if(!user){ // if user not in DB create new and store it
    user=await User.create({
      name:name,
      email:email
    })
  }
// generating new token from genToken function 
  let token=await genToken(user._id)
// store token in cookie
res.cookie("token",token,{
  http:true,
  secure:false,
  sameSite:"strict",
  maxAge:7*24*60*60*1000
})
// returning success code
return res.status(200).json(user)
    
  } catch (error) {
    return res.status(500).json({message:`Goggle Auth error: ${error}`})
  }
}

// creating logout function
export const logout=async (req,res)=>{
  // we remove token from cookie
  try {
     await res.clearCookie("token")
     return res.status(200).json({message:"Logout Successful"})
  } catch (error) {
    return res.status(200).json({message:`Someting went wrong:${error}`})
  }
}