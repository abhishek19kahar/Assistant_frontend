import React, {useContext , useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios';
import { MdKeyboardBackspace } from "react-icons/md";
import { userDataContext } from '../context/UserContext';

function Customize2() {
    const navigate = useNavigate();
    const { userData, backendImage, selectedImage, setUserData } = useContext(userDataContext)
    const [assistantName, setAssistantName] = useState(userData?.AssistantName
        || ""
    )
    const [loading, setLoading] = useState(false)

    const handleUpdateAssistant = async () => {
        try {
            let formData = new FormData()
            formData.append("assistantName", assistantName)
            if (backendImage) {
                formData.append("assistantImage", backendImage)
            } else {
                formData.append("imageUrl", selectedImage)
            }
            const result = await axios.post("http://localhost:5000/api/user/update", formData, { withCredentials: true })
            console.log(result.data);
            setUserData(result.data);
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <div className='w-full h-[100vh] bg-gradient-to-t from-[black] to-[#030353] flex justify-center items-center flex-col p-[20px] relative'> <MdKeyboardBackspace className='absolute top-[30px] left-[30px] cursor-pointer text-white w-[25px] h-[25px]'onClick={() => navigate('/customize')}/> 
            <h1 className='text-white mb-[40px] text-[30px] text-center'>Enter Your <span className='text-blue-200' >Assistant Name</span></h1>
            <input
                type="text"
                placeholder="Enter Your Assistant Name"
                className="w-full max-w-[600px] h-[60px] outline-none border-2 border-white bg-transparent text-white placeholder-gray-300 px-[20px] py-[10px] rounded-full text-[18px]" required onChange={(e) => setAssistantName
                    (e.target.value)} value={assistantName}
            />
            {assistantName && <button className="min-w-[300px] h-[60px] mt-[20px] bg-white rounded-full text-[19px] font-semibold transition-colors duration-300 hover:bg-blue-200 active:bg-blue-400" disabled={loading} onClick={() => {
               navigate('/home')
                handleUpdateAssistant()
                }}>
                {/* {loading? "Finally Create Your Assistant":"Loading...."} */}Finally Create Your Assistant
            </button>}

        </div>
    )
}

export default Customize2