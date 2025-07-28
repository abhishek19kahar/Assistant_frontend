import React, { useContext, useRef, useState } from 'react'
import Card from '../components/Card.jsx'
import image1 from '../assets/image1.png'
import image2 from '../assets/image2.jpg'
import image3 from '../assets/image3.png'
import image4 from '../assets/image4.png'
import image5 from '../assets/image5.png'
import image6 from '../assets/image6.jpeg'
import image7 from '../assets/image7.jpeg'
import { LuImagePlus } from "react-icons/lu";
import { userDataContext } from '../context/UserContext.jsx'
import { useNavigate } from 'react-router-dom'
import { MdKeyboardBackspace } from "react-icons/md";

function Customize() {
  const {userData, setUserData, handleCurrentUser, backendImage, setBackendImage, frontendImage, setFrontendImage, selectedImage, setSelectedImage} = useContext(userDataContext)
    const inputImage = useRef();
    const navigate = useNavigate();

    const handleImage = (e) => {
        const file = e.target.files && e.target.files[0];
        if (!file) {
            console.warn("No file selected or file is invalid.");
            return;
        }

        if (!file.type.startsWith("image/")) {
            alert("Please upload a valid image file.");
            return;
        }

        setBackendImage(file);
        setFrontendImage(URL.createObjectURL(file));
    };

    return (
        <div className='w-full h-[100vh] bg-gradient-to-t from-[black] to-[#030353] flex justify-center items-center flex-col p-[20px] relative'> <MdKeyboardBackspace className='absolute top-[30px] left-[30px] cursor-pointer text-white w-[25px] h-[25px]'onClick={() => navigate('/home')}/> 
            <h1 className='text-white mb-[40px] text-[30px] text-center'>
                Select your <span className='text-blue-200'>Assistant Image</span>
            </h1>

            <div className='w-full max-w-[900px] flex justify-center items-center flex-wrap gap-[15px]'>
                <Card image={image1} />
                <Card image={image2} />
                <Card image={image3} />
                <Card image={image4} />
                <Card image={image5} />
                <Card image={image6} />
                <Card image={image7} />

                <div
                    className={`w-[40px] h-[170px] lg:w-[150px] lg:h-[250px] bg-[#020220] border-2 border-[#0000ff66] rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-blue-950 cursor-pointer hover:border-4 hover:border-white flex items-center justify-center ${selectedImage == "input" ? "border-4 border-white shadow-2xl shadow-blue-950" : null}`}
                    onClick={() => {inputImage.current.click() 
                        setSelectedImage("input")}}
                >
                    {!frontendImage && <LuImagePlus className='text-white w-[25px] h-[25px]' />}
                    {frontendImage && <img src={frontendImage} alt="Uploaded" className='h-full object-cover' />}
                </div>

                <input
                    type='file'
                    accept='image/*'
                    ref={inputImage}
                    hidden
                    onChange={handleImage}
                />
            </div>
            {selectedImage && <button className="min-w-[150px] h-[60px] mt-[20px] bg-white rounded-full text-[19px] font-semibold transition-colors duration-300 hover:bg-blue-200 active:bg-blue-400" onClick={() => navigate('/customize2')}>
                Next
            </button>
}
                    </div>
    );
}

export default Customize;
