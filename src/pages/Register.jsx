import "./Register.css";
import React from 'react';
import { Link } from 'react-router-dom'

function Register() {


  return (
    <div>

      <div className='header'>
        <h1>Starred</h1>
      </div>
      <div className='login-form'>
        <h2>Register</h2>
        <input type="email" placeholder='Email' />
        <input type="password" placeholder='Password' />
        <input type="password" placeholder='Confirm Password' />
        <div className="register-btn">
          <button >Submit</button>
        </div>

        <div className="footer">
          <p>Already have an account? <Link to="/">Log In</Link></p>

        </div>
        <div className="temp">
          <Link to="/home">Go to Home Page</Link>
        </div>
      </div>
    </div>
  )
}

export default Register;
