import "./Landing.css";
import { Link, useNavigate } from "react-router-dom";
import React, { useState } from "react";

function Landing() {

  return (
    <div>
      <h1>Landing Page</h1>
      <div className="left-container">
        <h2>Starred</h2>
        <p>Starred is here to be a tool and help your kids</p>
      </div>
      <div>
        <Link to="/login">Login</Link>
      </div>
      <div>
        <Link to="/register">Register</Link>
      </div>
      <div>
        <Link style={{ color: "black" }} to="/home">Home</Link>
      </div>
    </div>
  );

}

export default Landing;
