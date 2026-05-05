import mongoose from "mongoose";

const connectdb=async ()=>{
  try {
    await mongoose.connect(process.env.MONGODB_URL)
    console.log("DataBase Connected");
  } catch (error) {
    console.log(`Database Error :  ${error}`);
    

  }
}

export default connectdb;