import React, { useState } from 'react';
import bg from '../assets/authBg.png';
import { IoEyeSharp, IoEyeOffSharp } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer } from 'react-toastify';
import { handleSuccess, handleError } from '../utils';

function SignUp() {
    const [showPassword, setShowPassword] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    //  Email must end with @acc.in
    const isValidEmail = (email) => {
        return /^[a-zA-Z0-9._%+-]+@(?:[a-zA-Z0-9-]+\.)*acc\.in$/.test(email);
    };

    //  Password: min 8 chars, 1 uppercase, 1 lowercase, 1 digit, 1 special char
    const isValidPassword = (password) => {
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(password);
    };

    const handleSignup = async (e) => {
        e.preventDefault();

        if (!name || !email || !password) {
            return handleError("Name, email, and password are required.");
        }

        if (!isValidEmail(email)) {
            return handleError("Only emails ending with '@acc.in' are allowed.");
        }

        if (!isValidPassword(password)) {
            return handleError("Password must be at least 8 characters and include uppercase, lowercase, digit, and special character.");
        }

        try {
            const response = await axios.post('https://assistant-backend-tau.vercel.app/api/auth/signup', {
                name,
                email,
                password
            }, {
                withCredentials: true
            });

            const { success, message, error } = response.data;

            if (success) {
                handleSuccess(message);
                setTimeout(() => navigate('/signin'), 1000);
            } else if (error) {
                const details = error?.details?.[0]?.message || "Something went wrong.";
                handleError(details);
            } else {
                handleError(message || "Signup failed.");
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
                onSubmit={handleSignup}
                className='w-[90%] h-[600px] max-w-[500px] bg-[#00000062] backdrop-blur shadow-lg shadow-black flex flex-col items-center justify-center gap-[20px] px-[20px]'
            >
                <h1 className='text-white text-[30px] font-semibold mb-[30px]'>
                    Register to <span className='text-blue-400'>Virtual Assistant</span>
                </h1>

                <input
                    type="text"
                    placeholder="Enter your Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full h-[60px] outline-none border-2 border-white bg-transparent text-white placeholder-gray-300 px-[20px] py-[10px] rounded-full text-[18px]"
                />

                <input
                    type="email"
                    placeholder="Email (e.g., john@acc.in)"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-[60px] outline-none border-2 border-white bg-transparent text-white placeholder-gray-300 px-[20px] py-[10px] rounded-full text-[18px]"
                />

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

                <button
                    type="submit"
                    className="min-w-[150px] h-[60px] mt-[20px] bg-white rounded-full text-[19px] font-semibold transition-colors duration-300 hover:bg-blue-200 active:bg-blue-400"
                >
                    SignUp
                </button>

                <p className='text-white text-[18px] cursor-pointer' onClick={() => navigate("/signin")}>
                    Already have an account? <span className='text-blue-400'>Sign In</span>
                </p>
            </form>

            <ToastContainer />
        </div>
    );
}

export default SignUp;
