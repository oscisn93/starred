import "./Register.css";

import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { createRoleModelAccount } from "../services/firebase";

function Register() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  function handleEmail(event) {
    setEmail(event.target.value);
  }

  function togglePasswordVisibility() {
    setShowPassword(prev => !prev);
  }

  function handlePassword(event) {
    setPassword(event.target.value);
  }

  function handleFirstName(event) {
    setFirstName(event.target.value);
  }

  function handleLastName(event) {
    setLastName(event.target.value);
  }

  function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);

    const userData = {
      email: email,
      firstName: firstName,
      lastName: lastName
    };

    createRoleModelAccount(userData, password).then((user) => {
      console.log(user);
      setLoading(false);
      return navigate("/home");
    });
  }

  return (
    <div className="register">
      <div className="container">

        <div className='login-form'>
          <h2>Create an Account!</h2>
          <div className="name-form">
            <input
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={handleFirstName}
            />
            <input
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={handleLastName}
            />
          </div>
          <input
            className="email"
            type="email"
            placeholder="Email"
            onChange={handleEmail}
            required
          />
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
            <button onClick={handleSubmit}>
              {loading ? "Registering..." : "Register"}
            </button>
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
