import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { checkTokenExpiration } from '../services/tokenService';

function Login({ renderLogin, setRenderLogin}) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setError] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const tokenValid = checkTokenExpiration();    
    if (tokenValid) {
      setRenderLogin(false);
    } else {
      setRenderLogin(true);
    }
  }, []);
  
  const handleLogin = async (e) => {
    e.preventDefault();
    if (username.length < 2) {
      setError('Minimum username length is 2 characters');
      return;
    }
    if (password.length < 5) {
      setError('Minimum password length is 5 characters');
      return;
    }
  
    try {
      const response = await axios.post("http://localhost:8000/burger/users/login", {
        username,
        password,
      }, {
        withCredentials: true,
      });
  
      if (response.status === 200) {
        setUsername("");
        setPassword("");
        setLoggedIn(true);
        setRenderLogin(false);
  
        // Store a token in localStorage with a 60-minute expiration to avoid refresh problems
        const authorizationToken = "ASMDIOWDASDK125301433162354"; 
        const expirationTime = new Date().getTime() + 60 * 60 * 1000; // 60 minutes from now
        localStorage.setItem('authorization', JSON.stringify({ token: authorizationToken, expiration: expirationTime }));
  
        // Set a timeout to remove the authorization token after 60 minutes if page not refreshed
        setTimeout(() => {
          localStorage.removeItem('authorization');
        }, 60 * 60000);
      }
    } catch (error) {
      setError('Error during login');
    }
  };
  

  return (
    <div>
      {renderLogin ? (
        <>
          <div className="login-container">
            <h2> Admin Portal</h2>
            <form className="login-form" onSubmit={handleLogin}>
              <label htmlFor="username">Username:</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />

              <label htmlFor="password">Password:</label>
              <input
                type="password"
                id="password"
                minLength={5}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <button type="submit">Login</button>
              {errors && <div className="error-message">{errors}</div>}
            </form>
          </div>
        </>
      ) : (
        ""
      )}
    </div>
  );
}

export default Login;
