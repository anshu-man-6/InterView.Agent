import React, { useState } from 'react';
import { motion } from "framer-motion";

import {
  FaUserTie,
  FaBriefcase,
  FaFileUpload,
  FaMicrophoneAlt,
  FaChartLine
} from 'react-icons/fa';

import axios from "axios";

import { ServerUrl } from "../App.jsx";

function Step1SetUp({ onStart }) {

  const [role, setRole] = useState("");
  const [experience, setExperience] = useState("");
  const [mode, setMode] = useState("Technical");

  const [resumeFile, setResumeFile] = useState(null);

  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);

  const [resumeText, setResumeText] = useState("");

  const [analysisDone, setAnalysisDone] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);

  /**
   * Upload Resume + Analyze
   */
  const handleUploadResume = async () => {

    if (!resumeFile || analyzing) return;

    try {

      setAnalyzing(true);

      const formData = new FormData();

      formData.append("resume", resumeFile);

      const result = await axios.post(
        `${ServerUrl}/api/interview/resume`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }
      );

      setRole(result.data.role || "");
      setExperience(result.data.experience || "");

      setSkills(result.data.skills || []);
      setProjects(result.data.projects || []);

      setResumeText(result.data.resumeText || "");

      setAnalysisDone(true);

    } catch (error) {

      console.log("Resume Upload Error:", error);

      setAnalysisDone(false);

    } finally {

      setAnalyzing(false);

    }
  };

  /**
   * Start Interview
   */
  const handleStartInterview = () => {

    if (!role || !experience) return;

    onStart({
      role,
      experience,
      mode,
      skills,
      projects,
      resumeText
    });
  };

  return (

    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className='min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 px-4'
    >

      <div className='w-full max-w-6xl bg-white rounded-3xl shadow-2xl grid md:grid-cols-2 overflow-hidden'>

        {/* LEFT SIDE */}
        <motion.div

          initial={{ x: -80, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.7 }}

          className='relative bg-gradient-to-br from-green-50 to-green-100 p-12 flex flex-col justify-center'
        >

          <h2 className='text-4xl font-bold text-gray-800 mb-6'>
            Start Your AI Interview
          </h2>

          <p className='text-gray-600 mb-10'>
            Practice real interview scenarios powered by AI.
            Improve communication, technical skills, and confidence.
          </p>

          <div className='space-y-5'>

            {
              [
                {
                  icon: <FaUserTie className='text-green-600 text-xl' />,
                  text: "Choose Role & Experience."
                },
                {
                  icon: <FaMicrophoneAlt className='text-green-600 text-xl' />,
                  text: "Smart Voice Interview."
                },
                {
                  icon: <FaChartLine className='text-green-600 text-xl' />,
                  text: "Performance Analytics."
                }

              ].map((item, index) => (

                <motion.div
                  key={index}
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 + index * 0.15 }}
                  whileHover={{ scale: 1.03 }}
                  className='flex items-center space-x-4 bg-white p-4 rounded-xl shadow-sm cursor-pointer'
                >

                  {item.icon}

                  <span className='text-gray-700 font-medium'>
                    {item.text}
                  </span>

                </motion.div>
              ))
            }

          </div>

        </motion.div>

        {/* RIGHT SIDE */}
        <motion.div

          initial={{ x: 80, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.7 }}

          className='p-12 bg-white'
        >

          <h2 className='text-3xl font-bold text-gray-800 mb-8'>
            Interview Setup
          </h2>

          <div className='space-y-6'>

            {/* Role Input */}
            <div className='relative'>

              <FaUserTie className='absolute top-4 left-4 text-gray-400' />

              <input
                type="text"
                placeholder='Enter Role'
                className='w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition'
                value={role}
                onChange={(e) => setRole(e.target.value)}
              />

            </div>

            {/* Experience Input */}
            <div className='relative'>

              <FaBriefcase className='absolute top-4 left-4 text-gray-400' />

              <input
                type="text"
                placeholder='Experience'
                className='w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition'
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
              />

            </div>

            {/* Interview Mode */}
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value)}
              className='w-full py-3 px-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition'
            >

              <option value="Technical">
                Technical Interview
              </option>

              <option value="HR">
                HR Interview
              </option>

            </select>

            {/* Resume Upload */}
            {!analysisDone && (

              <motion.div

                whileHover={{ scale: 1.02 }}

                onClick={() =>
                  document.getElementById('resumeUpload').click()
                }

                className='border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-green-500 hover:bg-green-50 transition'
              >

                <FaFileUpload className='text-4xl mx-auto text-green-600 mb-3' />

                <input
                  type="file"
                  accept='application/pdf'
                  id='resumeUpload'
                  className='hidden'

                  onChange={(e) => {
                    setResumeFile(e.target.files[0]);
                    setAnalysisDone(false);
                  }}
                />

                <p className='text-gray-600 font-medium'>

                  {
                    resumeFile
                      ? resumeFile.name
                      : "Click to upload resume"
                  }

                </p>

                {/* Analyze Button */}
                {resumeFile && (

                  <motion.button

                    onClick={(e) => {
                      e.stopPropagation();
                      handleUploadResume();
                    }}

                    whileHover={{ scale: 1.03 }}

                    className='mt-4 bg-gray-900 text-white px-5 py-2 rounded-lg hover:bg-gray-800 transition'
                  >

                    {
                      analyzing
                        ? "Analyzing..."
                        : "Analyze Resume"
                    }

                  </motion.button>

                )}

              </motion.div>
            )}

            {/* Resume Analysis Result */}
            {analysisDone && (

              <motion.div

                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}

                className='bg-gray-50 border border-gray-200 rounded-xl p-5 space-y-4'
              >

                <h3 className='text-lg font-semibold text-gray-800'>
                  Resume Analysis Result
                </h3>

                {/* Projects */}
                {projects.length > 0 && (

                  <div>

                    <p className='font-medium text-gray-700 mb-1'>
                      Projects:
                    </p>

                    <ul className='list-disc list-inside text-gray-600 space-y-1'>

                      {
                        projects.map((project, index) => (
                          <li key={index}>
                            {project}
                          </li>
                        ))
                      }

                    </ul>

                  </div>
                )}

                {/* Skills */}
                {skills.length > 0 && (

                  <div>

                    <p className='font-medium text-gray-700 mb-1'>
                      Skills:
                    </p>

                    <ul className='flex flex-wrap gap-2'>

                      {
                        skills.map((skill, index) => (
                          <li
                            key={index}
                            className='bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm'
                          >
                            {skill}
                          </li>
                        ))
                      }

                    </ul>

                  </div>
                )}

              </motion.div>
            )}

            {/* Start Interview Button */}
            <motion.button

              disabled={!role || !experience}

              onClick={handleStartInterview}

              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.95 }}

              className='w-full disabled:bg-gray-400 bg-green-600 hover:bg-green-700 text-white py-3 rounded-full text-lg font-semibold transition duration-300 shadow-md'
            >

              Start Interview

            </motion.button>

          </div>

        </motion.div>

      </div>

    </motion.div>
  );
}

export default Step1SetUp;