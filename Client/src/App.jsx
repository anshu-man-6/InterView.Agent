import './App.css';
import { Route, Routes } from 'react-router-dom';
import Auth from './pages/Auth.jsx';
import Home from './pages/Home.jsx';
import { useEffect } from 'react';
import axios from 'axios'; 
import { useDispatch } from 'react-redux';
import { setUserData } from './redux/userSlice.js';

// Backend server URL
export const ServerUrl = "http://localhost:8000";

function App() {

  const dispatch=useDispatch();

  useEffect(() => {
    const getUser = async () => {
      try {
        const result = await axios.get(
          `${ServerUrl}/api/user/current-user`,
          { withCredentials: true } // required for cookies
        );

        dispatch(setUserData(result.data))

      } catch (error) {
        console.log("Not authenticated:", error.response?.data?.message);
        dispatch(setUserData(null))
      }
    };

    getUser();
  }, [dispatch]);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/auth" element={<Auth />} />
    </Routes>
  );
}

export default App;