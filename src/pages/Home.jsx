import React, { useContext, useEffect, useRef, useState } from 'react';
import { userDataContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer } from 'react-toastify';
import ai from '../assets/ai.gif';
import user from '../assets/user.gif';
import { FaBars, FaTimes } from 'react-icons/fa';

const apiKey = 'AIzaSyCCjmZL58y2O_3ByAnXCSxVeUzsrwDPxA8';

function Home() {
  const navigate = useNavigate();
  const { userData, setUserData, getGeminiResponse } = useContext(userDataContext);

  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [userText, setUserText] = useState('');
  const [aiText, setAiText] = useState('');
  const recognitionRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [history, setHistory] = useState([]);

  const handleLogOut = async () => {
    try { //https://assistant-backend-5qny.onrender.com
      await axios.get("https://assistantbackend-production-7039.up.railway.app/api/auth/logout", { withCredentials: true });
      setUserData(null);
      navigate("/signin");
    } catch (error) {
      setUserData(null);
      console.log(error);
    }
  };

  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    setIsSpeaking(true);
    utterance.onend = () => {
      setIsSpeaking(false);
      setUserText('');
      setAiText('');
    };
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  const fetchAndPlayYouTube = async (query) => {
    try {
      const res = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&key=${apiKey}&maxResults=1&type=video`);
      const data = await res.json();
      const videoId = data?.items?.[0]?.id?.videoId;
      if (videoId) {
        window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank');
      } else {
        const msg = "Sorry, I couldn't find a video.";
        setAiText(msg);
        speak(msg);
      }
    } catch (err) {
      console.error("YouTube API error:", err);
      const msg = "Something went wrong while accessing YouTube.";
      setAiText(msg);
      speak(msg);
    }
  };

  const handleCommand = (data) => {
    const { type, userInput, response } = data;
    setAiText(response);
    speak(response);

    setHistory((prev) => [...prev, { user: userInput, ai: response }]);

    if (type === 'google_search') {
      window.open(`https://www.google.com/search?q=${encodeURIComponent(userInput)}`, '_blank');
    }
    if (type === 'youtube_play') {
      fetchAndPlayYouTube(userInput);
    }
    if (type === 'youtube_search') {
      window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(userInput)}`, '_blank');
    }
    if (type === 'whatsapp_open') {
      window.open(`https://web.whatsapp.com/send?text=${encodeURIComponent(userInput)}`, '_blank');
    }
    if (type === 'instagram_open') {
      window.open(`https://www.instagram.com/explore/search/?q=${encodeURIComponent(userInput)}`, '_blank');
    }
    if (type === 'spotify_search') {
      window.open(`https://open.spotify.com/search/${encodeURIComponent(userInput)}`, '_blank');
    } if (type === 'weather_show') {
      window.open(`https://www.google.com/search?q=weather+${encodeURIComponent(userInput)}`, '_blank');
    }
    if (type === 'calculator_open') {
      window.open(`https://www.google.com/search?q=calculator`, '_blank');
    }
    if (type === 'facebook_open') {
      window.open('https://www.facebook.com/', '_blank');
    }
    if (type === 'facebook_search') {
      window.open(`https://www.facebook.com/search/top?q=${encodeURIComponent(userInput)}`, '_blank');
    }
    if (type === 'spotify_open') {
      window.open('https://open.spotify.com/', '_blank');
    }
    if (type === 'chatgpt_open') {
      window.open('https://chat.openai.com/', '_blank');
    }
    if (type === 'chatgpt_search') {
      window.open(`https://chat.openai.com/?q=${encodeURIComponent(userInput)}`, '_blank');
    }
    if (type === 'claude_open') {
      window.open(`https://claude.ai/`, '_blank');
    }
    if (type === 'claude_search') {
      window.open(`https://claude.ai/?q=${encodeURIComponent(userInput)}`, '_blank');
    }
    if (type === 'gemini_open') {
      window.open(`https://gemini.google.com/`, '_blank');
    }
    if (type === 'gemini_search') {
      window.open(`https://gemini.google.com/app?q=${encodeURIComponent(userInput)}`, '_blank');
    }
    if (type === 'copilot_open') {
      window.open(`https://copilot.microsoft.com/`, '_blank');
    }
    if (type === 'copilot_search') {
      window.open(`https://copilot.microsoft.com/?q=${encodeURIComponent(userInput)}`, '_blank');
    }
    if (type === 'perplexity_open') {
      window.open(`https://www.perplexity.ai/`, '_blank');
    }
    if (type === 'perplexity_search') {
      window.open(`https://www.perplexity.ai/search?q=${encodeURIComponent(userInput)}`, '_blank');
    }
    if (type === 'you_open') {
      window.open(`https://you.com/`, '_blank');
    }
    if (type === 'you_search') {
      window.open(`https://you.com/search?q=${encodeURIComponent(userInput)}`, '_blank');
    }
  };

  useEffect(() => {
    if (!userData || !userData.assistantName) return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.error("Speech Recognition not supported.");
      return;
    }

    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(() => {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.lang = 'en-US';
        recognitionRef.current = recognition;

        recognition.onresult = async (e) => {
          const transcript = e.results[e.results.length - 1][0].transcript.trim();
          setUserText(transcript);
          setAiText('');
          if (transcript.toLowerCase().includes(userData.assistantName.toLowerCase())) {
            const data = await getGeminiResponse(transcript);
            handleCommand(data);
          }
        };

        recognition.onerror = (event) => {
          console.error("Recognition error:", event.error);
        };

        recognition.onstart = () => setIsListening(true);
        recognition.onend = () => setIsListening(false);

        const startRecognition = () => {
          try { recognition.start(); } catch (e) { console.warn("Already started"); }
        };

        const stopRecognition = () => {
          try { recognition.stop(); } catch (e) { console.warn("Already stopped"); }
        };

        startRecognition();

        const interval = setInterval(() => {
          stopRecognition();
          setTimeout(() => startRecognition(), 1000);
        }, 10000);

        return () => {
          clearInterval(interval);
          stopRecognition();
        };
      })
      .catch((err) => {
        console.error("Mic access error:", err);
        alert("Please allow microphone access.");
      });
  }, [userData, getGeminiResponse]);

  return (
    <div className='w-full min-h-screen bg-gradient-to-t from-black to-[#02023d] flex flex-col items-center px-4 pb-16 relative'>

      {/* Hamburger for small screens */}
      <div className="absolute top-6 left-6 z-50 block lg:hidden">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="text-white text-3xl focus:outline-none"
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Side Menu for mobile */}
      {menuOpen && (
        <div className="fixed top-0 left-0 w-[270px] h-full bg-black bg-opacity-30 backdrop-blur-md z-40 p-6 transition-transform duration-300 lg:hidden overflow-y-auto">
          <div className="mt-14 flex flex-col gap-4">
            <button
              className="text-white hover:bg-blue-500 transition px-4 py-2 rounded-md text-left"
              onClick={() => {
                setMenuOpen(false);
                navigate('/customize');
              }}
            >
              Customize Your Assistant
            </button>
            <button
              className="text-white hover:bg-red-500 transition px-4 py-2 rounded-md text-left"
              onClick={() => {
                setMenuOpen(false);
                handleLogOut();
              }}
            >
              Logout
            </button>

            {/* History in hamburger */}
            <div className="mt-4 max-h-[300px] overflow-y-auto bg-white bg-opacity-10 text-white text-sm rounded-md p-3">
              <h2 className="font-bold mb-2">Chat History</h2>
              {history.map((entry, idx) => (
                <div key={idx} className="mb-2">
                  <p><strong>User:</strong> {entry.user}</p>
                  <p><strong>AI:</strong> {entry.ai}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Static sidebar for large screens */}
      <div className="hidden lg:flex flex-col absolute top-10 left-10 gap-4">
        <button
          className="text-white bg-white bg-opacity-10 hover:bg-blue-500 transition px-4 py-2 rounded-md"
          onClick={() => navigate('/customize')}
        >
          Customize Your Assistant
        </button>
        <button
          className="text-white bg-white bg-opacity-10 hover:bg-red-500 transition px-4 py-2 rounded-md"
          onClick={handleLogOut}
        >
          Logout
        </button>
      </div>

      {/* Chat history on large screen */}
      <div className="hidden lg:block absolute top-10 right-10 w-[280px] max-h-[400px] overflow-y-auto bg-white bg-opacity-10 text-white text-sm rounded-md p-4">
        <h2 className="text-lg font-bold mb-2">Chat History</h2>
        {history.map((entry, idx) => (
          <div key={idx} className="mb-3">
            <p><strong>User:</strong> {entry.user}</p>
            <p><strong>AI:</strong> {entry.ai}</p>
          </div>
        ))}
      </div>

      {/* Assistant Image */}
      <div className='w-[300px] h-[400px] flex justify-center items-center overflow-hidden rounded-3xl shadow-lg'>
        <img
          src={userData?.assistantImage}
          alt="Assistant"
          className='h-full object-cover w-full'
        />
      </div>

      {/* GIFs */}
      {isSpeaking && (
        <div className="flex items-center gap-3 mt-2">
          <img src={ai} alt="Speaking" className="h-[200px] bg-transparent" />
        </div>
      )}
      {!isSpeaking && isListening && (
        <div className="flex items-center gap-3 mt-2">
          <img src={user} alt="Listening" className="h-[200px] bg-transparent" />
        </div>
      )}

      {/* Assistant Name */}
      <h1 className='text-white text-[18px] font-semibold'>I'm {userData?.assistantName}</h1>

      {/* Transcripts */}
      {userText && (
        <div className="text-white bg-white bg-opacity-10 rounded-lg px-4 py-2 mt-3 max-w-[90%] text-center">
          {userText}
        </div>
      )}
      {aiText && (
        <div className="text-white bg-white bg-opacity-10 rounded-lg px-4 py-2 mt-2 max-w-[90%] text-center">
          {aiText}
        </div>
      )}

      <ToastContainer />
      <footer className="w-full text-center py-2 absolute bottom-2 text-white text-sm opacity-80">
        © 2025 Made by <span className="font-semibold">Abhishek Jaykumar Kahar</span>
      </footer>
    </div>
  );
}

export default Home;





