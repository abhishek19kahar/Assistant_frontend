import React, { useState, useContext } from 'react';
import bg from '../assets/authBg.png';
import { IoEyeSharp, IoEyeOffSharp } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer } from 'react-toastify';
import { handleSuccess, handleError } from '../utils';
// import {userDataContext} from '../context/UserContext';

function SignIn() {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    // const { handleCurrentUser } = useContext(userDataContext);
    const navigate = useNavigate();

    const isValidEmail = (email) => {
        return /^[a-zA-Z0-9._%+-]+@(?:[a-zA-Z0-9-]+\.)*acc\.in$/.test(email);
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            return handleError("Email and password are required.");
        }

        if (!isValidEmail(email)) {
            return handleError("Only emails ending with '@acc.in' are allowed.");
        }

        try {
            const response = await axios.post('https://assistant-backend-tau.vercel.app/api/auth/signin', {
                email,
                password
            }, {
                withCredentials: true
            });

            const { success, message, error } = response.data;

            if (success) {
                // await handleCurrentUser(); 
                handleSuccess(message);
                setTimeout(() => navigate('/customize'), 1000);
            } else if (error) {
                const details = error?.details?.[0]?.message || "Something went wrong.";
                handleError(details);
            } else {
                handleError(message || "Login failed.");
            }
        } catch (err) {
            handleError(err?.response?.data?.message || err.message);
        }
    };

    return (
        <div
            className="w-full h-screen bg-cover bg-center flex justify-center items-center"
            style={{ backgroundImage: `url(${bg})` }}
        >
            <form
                onSubmit={handleLogin}
                className='w-[90%] h-[550px] max-w-[500px] bg-[#00000062] backdrop-blur shadow-lg shadow-black flex flex-col items-center justify-center gap-[20px] px-[20px] py-[30px] rounded-lg'
            >
                {/* Centered heading inside the form */}
                <h1 className='text-white text-[30px] font-semibold text-center mb-[10px]'>
                    Welcome back to <br />
                    <span className='text-blue-400'>Virtual Assistant</span>
                </h1>

                {/* Email Input */}
                <input
                    type="email"
                    placeholder="Email (e.g., john@acc.in)"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-[60px] outline-none border-2 border-white bg-transparent text-white placeholder-gray-300 px-[20px] py-[10px] rounded-full text-[18px]"
                />

                {/* Password Input */}
                <div className='w-full h-[60px] relative'>
                    <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full h-full outline-none border-2 border-white bg-transparent text-white placeholder-gray-300 px-[20px] py-[10px] pr-[50px] rounded-full text-[18px]"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute top-[50%] right-[20px] transform -translate-y-1/2 text-white text-[24px] cursor-pointer"
                    >
                        {showPassword ? <IoEyeOffSharp /> : <IoEyeSharp />}
                    </button>
                </div>

                {/* Sign In Button */}
                <button
                    type="submit"
                    className="min-w-[150px] h-[60px] mt-[20px] bg-white rounded-full text-[19px] font-semibold transition-colors duration-300 hover:bg-blue-200 active:bg-blue-400"
                >
                    Sign In
                </button>

                {/* Link to Sign Up */}
                <p className='text-white text-[18px] cursor-pointer' onClick={() => navigate("/signup")}>
                    Don't have an account? <span className='text-blue-400'>Register</span>
                </p>
            </form>

            <ToastContainer />
        </div>
    );
}

export default SignIn;
