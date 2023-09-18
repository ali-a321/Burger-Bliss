import React from 'react'
import { useNavigate } from 'react-router';

function Logout({setRenderLogout}) {
    const navigate = useNavigate()
    
    const handleLogout = () => {

        localStorage.clear();
        console.log("Logout")
        navigate('/')
      
    }

  return (
    <div className="login-container">
        <div className='closeBtn' onClick={() => setRenderLogout(false)}> X </div>
        <form className="login-form" onSubmit={handleLogout}>
          <label htmlFor="logout" className='logoutPrompt'> Are you sure you want to log out? </label>
           <button type="submit" className='logoutBtn'> Logout </button>
        </form>
      </div>
  )
}

export default Logout