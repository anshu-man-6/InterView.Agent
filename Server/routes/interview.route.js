import express from "express";
import isAuth from "../middlewares/isAuth";
import { upload } from "../middlewares/multer";
import { analyzeResume } from "../controllers/interview.controller";


// Create a new router instance
const interviewRouter = express.Router();

interviewRouter.post("/resume",isAuth,upload.single("resume"),analyzeResume)



// Export router to use in main server file
export default interviewRouter;