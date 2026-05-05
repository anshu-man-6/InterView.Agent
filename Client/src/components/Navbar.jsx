import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from "framer-motion"; // used for animation
import { BsRobot, BsCoin } from 'react-icons/bs';
import { HiOutlineLogout } from "react-icons/hi";
import { FaUserAstronaut } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { ServerUrl } from "../App";
import { setUserData } from '../redux/userSlice';
import Auth from '../pages/Auth';
import AuthModel from "../components/AuthModel";

function Navbar() {

  // Get logged-in user data from Redux
  const { userData } = useSelector((state) => state.user);

  // Local UI states
  const [showCreditPopup, setShowCreditPopup] = useState(false);
  const [showUserPopup, setShowUserPopup] = useState(false);
  const [showAuth, setShowAuth] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  /*
    Function: handleLogout
    - Calls backend logout API
    - Clears user data from Redux
    - Closes popups
    - Redirects to home page
  */
  const handlelogout = async () => {
    try {
      await axios.get(`${ServerUrl}/api/auth/logout`, {
        withCredentials: true
      });

      dispatch(setUserData(null));
      setShowCreditPopup(false);
      setShowUserPopup(false);
      navigate("/");
    } catch (error) {
      console.log("Logout Error:", error);
    }
  };

  return (
    <div className='bg-[#f3f3f3] flex justify-center px-4 pt-6'>

      {/* Navbar Container */}
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className='w-full max-w-6xl bg-white rounded-[24px] shadow-sm border border-gray-200 px-8 py-4 flex justify-between items-center relative'
      >

        {/* Logo Section */}
        <div className='flex items-center gap-3 cursor-pointer'>
          <div className='bg-black text-white p-2 rounded-lg'>
            <BsRobot size={18} />
          </div>
          <h1 className='font-semibold hidden md:block text-lg'>InterView.Agent</h1>
        </div>

        {/* Right Side Controls */}
        <div className='flex items-center gap-6 relative'>

          {/* Credits Button */}
          <div className='relative'>
            <button
              onClick={() => {
                // If user not logged in → open auth modal
                if (!userData) {
                  setShowAuth(true);
                  return;
                }
                // Toggle credit popup
                setShowCreditPopup(!showCreditPopup);
                setShowUserPopup(false);
              }}
              className='flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full hover:bg-gray-200 transition'
            >
              <BsCoin size={20} />
              {userData?.credits || 0}
            </button>

            {/* Credit Popup */}
            {showCreditPopup && (
              <div className='absolute right-[-50px] mt-3 w-64 bg-white shadow-xl border border-gray-200 rounded p-5 z-50'>
                <p className='text-sm text-gray-600 mb-4'>
                  Need more credits to continue interviews
                </p>
                <button
                  onClick={() => navigate("/pricing")}
                  className='w-full bg-black text-white py-2 rounded-lg text-sm'
                >
                  Buy credits
                </button>
              </div>
            )}
          </div>

          {/* User Profile Button */}
          <div className='relative'>
            <button
              onClick={() => {
                // If not logged in → open auth modal
                if (!userData) {
                  setShowAuth(true);
                  return;
                }
                // Toggle user popup
                setShowUserPopup(!showUserPopup);
                setShowCreditPopup(false);
              }}
              className='w-9 h-9 bg-black text-white rounded-full flex items-center justify-center font-semibold'
            >
              {/* Show first letter of user name or default icon */}
              {userData
                ? userData.name.slice(0, 1).toUpperCase()
                : <FaUserAstronaut />
              }
            </button>

            {/* User Popup */}
            {showUserPopup && (
              <div className='absolute right-0 mt-3 w-48 bg-white shadow-xl border border-gray-200 rounded-xl p-4 z-50'>
                <p className='text-md text-blue-500 font-medium mb-1'>
                  {userData?.name}
                </p>

                {/* Navigate to history */}
                <button
                  onClick={() => navigate("/history")}
                  className='w-full text-left text-sm py-2 hover:text-black text-gray-600'
                >
                  Interview History
                </button>

                {/* Logout Button */}
                <button
                  onClick={handlelogout}
                  className='w-full text-left text-sm py-2 flex items-center gap-2 text-red-500'
                >
                  <HiOutlineLogout size={16} />
                  Logout
                </button>
              </div>
            )}
          </div>

        </div>
      </motion.div>

      {/* Auth Modal (shown when user not logged in) */}
      

    {showAuth && <AuthModel onclose={() => setShowAuth(false)} />}

    </div>
  );
}

export default Navbar;