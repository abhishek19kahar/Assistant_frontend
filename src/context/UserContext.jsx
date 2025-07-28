import axios from 'axios';
import React, { createContext, useEffect, useState } from 'react';

export const userDataContext = createContext();

function UserContext({ children }) {
  const [userData, setUserData] = useState(null);
  const [frontendImage, setFrontendImage] = useState(null);
  const [backendImage, setBackendImage] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  const handleCurrentUser = async () => {
    try {
      const result = await axios.get('http://localhost:5000/api/user/current', {
        withCredentials: true,
      });
      setUserData(result.data);
      // console.log("✅ Current user fetched:", result.data);
    } catch (error) {
      console.error("❌ Error fetching user:", error.response?.data || error.message);
      setUserData(null);
    }
  };

  const getGeminiResponse = async (command) => {
    if (!command) {
      console.warn("⚠️ No command passed to assistant.");
      return;
    }

    try {
      const result = await axios.post(
        'http://localhost:5000/api/user/asktoassistant',
        { command },
        { withCredentials: true }
      );
      // console.log("🤖 Assistant reply:", result.data);
      return result.data;
    } catch (error) {
      console.error("❌ Error from assistant:", error.response?.data || error.message);
    }
  };

  // ✅ Correct useEffect placement
  useEffect(() => {
    handleCurrentUser();
    // You can test assistant here if you want, otherwise remove
    // getGeminiResponse("hello");
  }, []);

  const value = {
    userData,
    setUserData,
    handleCurrentUser,
    backendImage,
    setBackendImage,
    frontendImage,
    setFrontendImage,
    selectedImage,
    setSelectedImage,
    getGeminiResponse
  };

  return (
    <userDataContext.Provider value={value}>
      {children}
    </userDataContext.Provider>
  );
}

export default UserContext;
