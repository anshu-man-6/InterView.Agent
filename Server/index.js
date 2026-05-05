import express from "express"
import dotenv from "dotenv"
import connectdb from "./config/connectDb.js";
import cookieParser from "cookie-parser";
dotenv.config();
import cors from "cors"
import authRouter from "./routes/auth.route.js";
import userRouter from "./routes/user.route.js";
const app=express();

app.use(cors(
  {
    origin:"http://localhost:5173",
    credentials:true
  }
)); // to establis connection between frontend and backend


app.use(express.json()) // to get message in json format
app.use(cookieParser()) // to parse dta from cookie


//create api authentication and logout
app.use("/api/auth",authRouter)

app.use("/api/user",userRouter)











const port=process.env.PORT||6000;

app.listen(port,()=>{
  console.log("Server is running");
  connectdb();
})