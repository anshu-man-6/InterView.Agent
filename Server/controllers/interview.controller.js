// Import Node.js file system module
import fs from "fs";

// Import PDF parser library
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";

// Import AI service function
import { askAi } from "../services/openRouter.services.js";

// Import User model
import User from "../models/userModel.js";

/**
 * ---------------------------------------------------------
 * Resume Analysis Controller
 * ---------------------------------------------------------
 * Purpose:
 * - Accept uploaded resume PDF
 * - Extract text from PDF
 * - Send resume text to AI
 * - Get structured information like:
 *    role, experience, projects, skills
 * - Return analyzed result
 * ---------------------------------------------------------
 */
export const analyzeResume = async (req, res) => {

  // Store uploaded file path
  let filepath = null;

  try {

    /**
     * Check if file exists
     */
    if (!req.file) {

      return res.status(400).json({
        success: false,
        message: "Resume file is required"
      });

    }

    // Save uploaded file path
    filepath = req.file.path;

    /**
     * ---------------------------------------------------------
     * Read Uploaded PDF File
     * ---------------------------------------------------------
     */

    // Read file buffer
    const fileBuffer = await fs.promises.readFile(filepath);

    // Convert buffer into Uint8Array for pdf.js
    const uint8Array = new Uint8Array(fileBuffer);

    // Load PDF document
    const pdf = await pdfjsLib
      .getDocument({ data: uint8Array })
      .promise;

    /**
     * ---------------------------------------------------------
     * Extract Text From All PDF Pages
     * ---------------------------------------------------------
     */

    let resumeText = "";

    // Loop through all pages
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {

      // Get current page
      const page = await pdf.getPage(pageNum);

      // Extract text content
      const content = await page.getTextContent();

      // Convert page items into string text
      const pageText = content.items
        .map(item => item.str || "")
        .join(" ");

      // Append page text
      resumeText += pageText + "\n";
    }

    /**
     * ---------------------------------------------------------
     * Clean Extracted Text
     * ---------------------------------------------------------
     * Remove extra spaces and line breaks
     */

    resumeText = resumeText
      .replace(/\s+/g, " ")
      .trim();

    /**
     * ---------------------------------------------------------
     * Prepare AI Prompt
     * ---------------------------------------------------------
     */

    const messages = [

      // System instruction for AI
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

      // Resume text sent to AI
      {
        role: "user",
        content: resumeText
      }
    ];

    /**
     * ---------------------------------------------------------
     * Call AI Model
     * ---------------------------------------------------------
     */

    const aiResponse = await askAi(messages);

    /*
     
     * Parse AI Response
     
     */

    let parsed;

    try {

      // Try normal JSON parsing
      parsed = JSON.parse(aiResponse);

    } catch {

      /**
       * Some AI models return JSON inside markdown
       * Example:
       * ```json
       * { ... }
       * ```
       *
       * Remove markdown formatting before parsing
       */
      const cleaned = aiResponse
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      parsed = JSON.parse(cleaned);
    }

    /**
     * ---------------------------------------------------------
     * Send Final Response
     * ---------------------------------------------------------
     */

    return res.status(200).json({

      success: true,

      role: parsed.role || "",
      experience: parsed.experience || "",

      projects: parsed.projects || [],
      skills: parsed.skills || [],

      // Optional: send extracted resume text
      resumeText

    });

  } catch (error) {

    /**
     * Handle Server Errors
     */
    console.log("Resume Analysis Error:", error);

    return res.status(500).json({

      success: false,
      message: error.message

    });

  } finally {

    /**
     * ---------------------------------------------------------
     * Delete Uploaded File After Processing
     * ---------------------------------------------------------
     */

    if (filepath && fs.existsSync(filepath)) {

      fs.unlinkSync(filepath);

    }
  }
};



/**
 * ---------------------------------------------------------
 * Generate Interview Questions Controller
 * ---------------------------------------------------------
 * Purpose:
 * - Generate AI-based interview questions
 * - Questions are generated using:
 *    role
 *    experience
 *    skills
 *    projects
 *    resume text
 *    interview mode
 * ---------------------------------------------------------
 */
export const generateQuestion = async (req, res) => {

  try {

    /**
     * Extract request body data
     */
    let {
      role,
      experience,
      mode,
      resumeText,
      projects,
      skills
    } = req.body;

    /**
     * Remove unwanted spaces
     */
    role = role?.trim();
    experience = experience?.trim();
    mode = mode?.trim();

    /**
     * Validate required fields
     */
    if (!role || !experience || !mode) {

      return res.status(400).json({
        message: "Role, Experience and Mode are required."
      });

    }

    /**
     * ---------------------------------------------------------
     * Find Logged-in User
     * ---------------------------------------------------------
     */

    const user = await User.findById(req.userId);

    // User not found
    if (!user) {

      return res.status(404).json({
        message: "User not found."
      });

    }

    /**
     * Check user credits
     */
    if (user.credits < 50) {

      return res.status(404).json({
        message: "Not enough credits. Minimum 50 required."
      });

    }

    /**
     * ---------------------------------------------------------
     * Convert Arrays Into Readable Text
     * ---------------------------------------------------------
     */

    const projectText =
      Array.isArray(projects) && projects.length
        ? projects.join(", ")
        : "None";

    const skillsText =
      Array.isArray(skills) && skills.length
        ? skills.join(", ")
        : "None";

    /**
     * Safe fallback for resume text
     */
    const safeResume = resumeText?.trim() || "None";

    /**
     * ---------------------------------------------------------
     * Create User Prompt
     * ---------------------------------------------------------
     */

    const userPrompt = `
Role: ${role}
Experience: ${experience}
InterviewMode: ${mode}
Projects: ${projectText}
Skills: ${skillsText}
Resume: ${safeResume}
`;

    /**
     * Validate prompt
     */
    if (!userPrompt.trim()) {

      return res.status(400).json({
        message: "Prompt content is empty."
      });

    }

    /**
     * ---------------------------------------------------------
     * AI Messages
     * ---------------------------------------------------------
     */

    const message = [

      /**
       * System Prompt
       * Controls AI behavior
       */
      {
        role: "system",

        content: `
You are a real human interviewer conducting a professional interview.

Speak in simple, natural English as if you are directly talking to the candidate.

Generate exactly 5 interview questions.

Strict Rules:
- Each question must contain between 15 and 25 words.
- Each question must be a single complete sentence.
- Do NOT add explanations.
- Do NOT add extra text before or after.
- One question per line only.
- Keep language simple and conversational.
- Questions must feel practical and realistic.

Difficulty progression:
Question 1 -> Easy
Question 2 -> Easy
Question 3 -> Medium
Question 4 -> Medium
Question 5 -> Hard

Generate questions using:
- Candidate role
- Experience
- Projects
- Skills
- Resume details
- Interview mode
`
      },

      /**
       * User Data Sent To AI
       */
      {
        role: "user",
        content: userPrompt
      }
    ];

    /**
     * ---------------------------------------------------------
     * Generate AI Questions
     * ---------------------------------------------------------
     */

    const aiResponse = await askAi(message);
    
    /**
     * TODO:
     * - Deduct user credits
     * - Store interview session
     * - Split questions into array
     * - Return formatted response
     */


    if(!aiResponse || aiResponse.trim()){
      return res.status(500).json({message:"AI returned empty response."})
    }

    const questionArray=aiResponse.split("/n").map(q=>q.trim()).filter(q=>q.length>0).slice(0,5);
   

    if(questionArray.length==0){
      return res.status(500).json({message:"AI failed to generates questions."});
    }
  } catch (error) {

    /**
     * Handle Errors
     */
    console.log("Question Generation Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message
    });

  }
};