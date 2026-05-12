import React, { useState } from 'react';

// Import setup step component
import Step1SetUp from "../components/Step1SetUp";

// Import interview step component
import Step2Interview from "../components/Step2Interview";

// Import final report step component
import Step3Report from "../components/Step3Report";


/**
 * ---------------------------------------------------------
 * InterviewPage Component
 * ---------------------------------------------------------
 * Purpose:
 * - Manage complete interview flow
 * - Handle step navigation
 * - Store interview-related data
 *
 * Steps:
 * 1 -> Interview setup
 * 2 -> Live interview
 * 3 -> Interview report
 * ---------------------------------------------------------
 */
function InterviewPage() {

  /**
   * ---------------------------------------------------------
   * step State
   * ---------------------------------------------------------
   * Controls which screen/component is visible
   *
   * Initial Value:
   * 1 => Setup Screen
   * ---------------------------------------------------------
   */
  const [step, setStep] = useState(1);

  /**
   * ---------------------------------------------------------
   * interviewData State
   * ---------------------------------------------------------
   * Stores:
   * - Setup data
   * - Interview data
   * - Final report data
   * ---------------------------------------------------------
   */
  const [interviewData, setInterviewData] = useState(null);

  return (

    /**
     * Main Page Container
     */
    <div className='min-h-screen bg-gray-50'>

      {/* =====================================================
          STEP 1 : INTERVIEW SETUP
         ===================================================== */}

      {step == 1 && (

        <Step1SetUp

          /**
           * onStart Callback
           * Runs when setup is completed
           */
          onStart={(data) => {

            // Save setup/interview data
            setInterviewData(data);

            // Move to interview step
            setStep(2);

          }}
        />
      )}


      {/* =====================================================
          STEP 2 : LIVE INTERVIEW
         ===================================================== */}

      {step == 2 && (

        <Step2Interview

          /**
           * Pass interview data to component
           */
          interviewData={interviewData}

          /**
           * onFinish Callback
           * Runs after interview ends
           */
          onFinish={(report) => {

            // Save final report
            setInterviewData(report);

            /**
             * Move to report page
             * NOTE:
             * Here step should probably be 3
             * Currently it is set to 2 again
             */
            setStep(3);

          }}
        />
      )}


      {/* =====================================================
          STEP 3 : FINAL REPORT
         ===================================================== */}

      {step == 3 && (

        <Step3Report

          /**
           * Pass final report data
           */
          report={interviewData}

        />
      )}

    </div>
  );
}

export default InterviewPage;