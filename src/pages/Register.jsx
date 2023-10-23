import "./Register.css";
import React from 'react';
import { Link } from 'react-router-dom'

function Register() {

  return (
    <div>
      <div>
        <Link to="/home">Go to Home Page</Link>
      </div>
      <div className='header'>
        <h1>Starred</h1>
      </div>
      <div className='login-form'>
        <h2>Register</h2>
        <input type="email" placeholder='Email' />
        <input type="password" placeholder='Password' />
        <input type="password" placeholder='Confirm Password' />
        <button>Submit</button>
        <div className="register-btn">
          <p>Already have an account? <a href="/">Log in</a></p>

        </div>
      </div>
    </div>
  )
}

export default Register;
