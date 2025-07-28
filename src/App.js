// import React, { useContext } from 'react'
import { Route, Routes } from 'react-router-dom';
import {Navigate} from 'react-router-dom';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Customize from './pages/Customize';
import Home from './pages/Home';
import Customize2 from './pages/Customize2';
// import { userDataContext } from './context/UserContext';

function App(){
  // const {userData, setUserData} = useContext(userDataContext)
  return(
    <div>
     <Routes>
      
      <Route path='/' element={<Navigate to="/signin "/>} />
      <Route path='/signup' element={<SignUp/>}/>
      <Route path='/home' element={<Home/>}/>
      <Route path='/signin' element={<SignIn/>}/>
      <Route path='/customize' element={<Customize/>}/>
      <Route path='/customize2' element={<Customize2/>}/>
     </Routes>
    </div>
  )
}

export default App;