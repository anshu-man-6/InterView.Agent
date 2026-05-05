import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { FaTimes } from 'react-icons/fa';
import Auth from '../pages/Auth';

function AuthModel({ onclose }) {

  // Get user data from Redux store
  const { userData } = useSelector((state) => state.user);

  /*
    useEffect:
    - Runs when userData changes
    - If user logs in → close modal automatically
  */
  useEffect(() => {
    if (userData) {
      onclose();
    }
  }, [userData, onclose]);

  return (
    <div className='fixed inset-0 z-999 flex items-center justify-center bg-black/10 backdrop-blur-sm px-4'>

      <div className='relative w-full max-w-md'>

        {/* Close Button */}
        <button
          onClick={onclose}  // call function on click
          className='absolute top-8 right-5 text-gray-800 hover:text-black text-xl'
        >
          <FaTimes size={18} />
        </button>

        {/* Auth Component inside Modal */}
        <Auth isModel={true} />

      </div>

    </div>
  );
}

export default AuthModel;