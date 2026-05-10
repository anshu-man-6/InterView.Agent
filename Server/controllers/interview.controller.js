import fs from "fs";

import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";

import { askAi } from "../services/openRouter.services.js";

import User from "../models/userModel.js"

/**
 * Analyze Resume Controller
 */
export const analyzeResume = async (req, res) => {

  let filepath = null;

  try {

    // Check uploaded file
    if (!req.file) {

      return res.status(400).json({
        success: false,
        message: "Resume file is required"
      });

    }

    filepath = req.file.path;

    /**
     * Read PDF File
     */
    const fileBuffer = await fs.promises.readFile(filepath);

    const uint8Array = new Uint8Array(fileBuffer);

    const pdf = await pdfjsLib
      .getDocument({ data: uint8Array })
      .promise;

    /**
     * Extract Text From PDF
     */
    let resumeText = "";

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {

      const page = await pdf.getPage(pageNum);

      const content = await page.getTextContent();

      const pageText = content.items
        .map(item => item.str || "")
        .join(" ");

      resumeText += pageText + "\n";
    }

    /**
     * Clean Text
     */
    resumeText = resumeText
      .replace(/\s+/g, " ")
      .trim();

    /**
     * AI Prompt
     */
    const messages = [

      {
        role: "system",

        content: `
Extract structured data from resume.

Return ONLY valid JSON.

{
  "role":"string",
  "experience":"string",
  "projects":["project1","project2"],
  "skills":["skill1","skill2"]
}
`
      },

      {
        role: "user",
        content: resumeText
      }
    ];

    /**
     * Ask AI
     */
    const aiResponse = await askAi(messages);

    /**
     * Parse AI Response
     */
    let parsed;

    try {

      parsed = JSON.parse(aiResponse);

    } catch {

      // Handle markdown JSON response
      const cleaned = aiResponse
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      parsed = JSON.parse(cleaned);
    }

    /**
     * Send Response
     */
    return res.status(200).json({

      success: true,

      role: parsed.role || "",
      experience: parsed.experience || "",

      projects: parsed.projects || [],
      skills: parsed.skills || [],

      resumeText

    });

  } catch (error) {

    console.log("Resume Analysis Error:", error);

    return res.status(500).json({

      success: false,
      message: error.message

    });

  } finally {

    /**
     * Delete Uploaded File
     */
    if (filepath && fs.existsSync(filepath)) {

      fs.unlinkSync(filepath);

    }
  }
};



export const generateQuestion=async (req,res) => {
  

  try {
    
 const {role,experience,mode,resumeText,projects,skills}=req.body

role=role?.trim();
experience=experience?.trim();
mode=mode?.trim();

if(!role || !experience || !mode){
  return res.status(400).json({message:"Role, Experience and Mode are required."})
}

 const user=await User.findById(req.userId)

 if(!user){
  return res.status(404).json({message:"User not found."})

 }

 if(user.credits<50){
  return res.status(404).json({message:"Not enough credits. Minimum 50 required."})
 }

const projectText=Array.isArray(projects)&&projects.length?projects.join(","):"None"

const skillsText=Array.isArray(skills)&&skills.length?skills.join(","):"None"


const safeResume=resumeText?.trim() || "None";


const userPrompt=`
Role:${role},
Experience:${experience},
InterviewMode:${mode},
Projects:${projectText},
Skills:${skillsText},
Resume:${safeResume}

`;

if(!userPrompt.trim()){
  return res.status(400).json({message:"Prompt content is empty."})
}

const message=[
  {
    role:"system",
    content:`
    You are a real human interviewer conducting a professional interview. Speak in simple, natural English as if you are directly talking to the candidate.
    
    Generate exactly 5 interview question.
    Strict Rules:
    - Each question must contain between 15 and 25 words.
    - Each question must be a single complete sentence.
    -Do NOT add explanations.
    -Do NOT add extra text before or after.
    -One question per line only.
    -Keep language simple and conversational.
    -Questions must feel practical and realistic.
    
    Difficulty progression:
    Question 1-> easy
    Question 2-> easy
    Question 3-> medium
    Question 4-> medium
    Question 5-> Hard


    Make questions based on the candidate role, experience , projects,interviewMode,skills and resume details.
    `
  },

  {
    role:"user",
    content:userPrompt
  }
];

const aiResponse=await askAi(message)



  } catch (error) {
    
  }
}