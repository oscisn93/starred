import "./Landing.css";
import { Link, useNavigate } from "react-router-dom";
import React, { useState } from "react";

function Landing() {

  return (
    <div className="landing">
      <div className="left-container">
        <h1>Starred</h1>
        <p>Welcome!</p>
        <p>
          Please Log In or Create an Account
        </p>
        <div className="buttons">
          <Link to="/login">
            <button className="login-button">Login</button>
          </Link>
          <Link to="/register">
            <button className="register-button">Register</button>
          </Link>
        </div>
      </div>
      <div className="right-container">

        <div className="image-placeholder"></div>
      </div>
    </div>
  );

}

export default Landing;
