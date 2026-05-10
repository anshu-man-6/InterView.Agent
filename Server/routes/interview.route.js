import express from "express";
import isAuth from "../middlewares/isAuth.js";
import { upload } from "../middlewares/multer.js";
import { analyzeResume } from "../controllers/interview.controller.js";


// Create a new router instance
const interviewRouter = express.Router();

interviewRouter.post("/resume",isAuth,upload.single("resume"),analyzeResume)



// Export router to use in main server file
export default interviewRouter;