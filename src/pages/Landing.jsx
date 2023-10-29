import "./Landing.css";
import { Link, useNavigate } from "react-router-dom";
import React, { useState } from "react";

function Landing() {

  return (
    <div className="landing">
      <div className="left-container">
        <h1>Starred</h1>
        <h3>🌟 Transform Your Child's Routine into a World of Achievements! 🌟</h3>
        <p>
          Our platform is designed to make daily tasks and
          responsibilities exciting and rewarding for your
          little ones, helping to instill a sense of achievement
          and responsibility from an early age. To get started,
          simply register for an account and create a profile. If you
          already have an account, please sign in!
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
