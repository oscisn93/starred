import "./Register.css";
import React, { useState } from 'react';
import { Link } from 'react-router-dom'

function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");

  function togglePasswordVisibility() {
    setShowPassword(prev => !prev);
  }

  function handlePassword(event) {
    setPassword(event.target.value);
  }

  return (
    <div className="register">
      <div className='header'>
        {/* <h1>Starred</h1> */}
      </div>
      <div className="container">

        <div className='login-form'>
          <h2>Create an Account!</h2>
          <input type="email" placeholder='Email' />
          <div className="password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              onChange={handlePassword}
              required
            />
            {password.length > 0 && (
              <span
                className="password-visibility"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? "Hide" : "Show"}
              </span>
            )}

          </div>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Confirm Password"
            onChange={handlePassword}
            required
          />



          <div className="register-btn">
            <button >Submit</button>
          </div>

          <div className="footer">
            <p>Already have an account? <Link to="/login">Log In</Link></p>

          </div>
          <div className="temp">
            <Link to="/home">Go to Home Page</Link>
          </div>
        </div>
      </div>


    </div>
  )
}

export default Register;
