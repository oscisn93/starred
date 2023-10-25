import "./Login.css";
import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { signIn } from "../services/firebase";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

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

  return (
    <div className="login">
      <div className="header">
        <h1>Starred</h1>
      </div>
      <div className="login-form">
        <h2>Login</h2>
        <input
          type="email"
          placeholder="Email"
          onChange={handleEmail}
          required
        />
        <input
          type="password"
          placeholder="Password"
          onChange={handlePassword}
          required
        />
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
          <p>Don't have an account? <a href="/register">Sign Up</a></p>

        </div>
      </div>
    </div>
  );
}

export default Login;
