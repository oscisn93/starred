import "./Login.css";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { userService } from "../services/firebase";
import "../services/firebase";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // @ts-ignore
  function handleEmail(event) {
    setEmail(event.target.value);
  }

  // @ts-ignore
  function handlePassword(event) {
    setPassword(event.target.value);
  }

  // @ts-ignore
  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    await userService.signIn(email, password);
    return navigate("/home");
  }

  function togglePasswordVisibility() {
    setShowPassword((prev) => !prev);
  }

  return (
    <div className="center">
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
              <p>
                Don't have an account? <Link to="/register">Sign Up</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
