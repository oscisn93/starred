import "./Login.css";
import { Link, useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { signIn } from "../services/firebase";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  function handleEmail(event) {
    setEmail(event.target.value);
  }

  function handlePassword(event) {
    setPassword(event.target.value);
  }

  function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    signIn(email, password).then((user) => {
      console.log(user);
      setLoading(false);
      return navigate("/home");
    });
  }

  function togglePasswordVisibility() {
    setShowPassword(prev => !prev);
  }

  return (
    <div className="center">
      <div className="title">
        <h1>Starred</h1>
      </div>
      <div className="login">
        <div className="container">

          <div className="login-form">
            <h2>Welcome Back!</h2>
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
              <span
                className="password-visibility"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? "Hide" : "Show"}
              </span>
            </div>

            {/* <div className="remember-me">
          <input type="checkbox" />
          <p>Remember me</p>
        </div> */}

            <div className="submit-btn">
              <button onClick={handleSubmit}>
                {loading ? "Logging in..." : "Login"}
              </button>
            </div>
            <div className="register-btn">
              <p>Don't have an account? <Link to="/register">Sign Up</Link></p>

            </div>
          </div>
        </div>
      </div>
    </div>

  );
}

export default Login;
