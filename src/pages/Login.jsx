import "./Login.css";
import { useNavigate } from "react-router-dom";
import React from "react";
import { signIn } from "../services/firebase";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  function handleEmail(event) {
    setEmail(event.target.value);
  }

  function handlePassword(event) {
    setPassword(event.target.value);
  }

  function handleSubmit(event) {
    event.preventDefault();
    signIn(email, password).then((user) => {
      console.log(user);
      return navigate("/home");
    });
  }

  return (
    <div>
      <div className="header">
        <h1>Starred</h1>
      </div>
      <div className="login-form">
        <h2>Login</h2>
        <input type="email" placeholder="Email" onChange={handleEmail} />
        <input
          type="password"
          placeholder="Password"
          onChange={handlePassword}
        />
        <div className="submit-btn">
          <button onClick={handleSubmit}>Login</button>
        </div>
        <div className="register-btn">
          <button onClick={() => navigate("/register")}>Register</button>
        </div>
      </div>
    </div>
  );
}

export default Login;
