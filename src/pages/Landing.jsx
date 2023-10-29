import "./Landing.css";
import Register from "../components/Register";
import { useState } from "react";
import Login from "../components/Login";

function Landing() {
  const views = {
    login: "login",
    register: "register",
  };
  const [view, setView] = useState(null);
  const setLoginView = () => setView(views.login);
  const setRegisterView = () => setView(views.register);

  return !view ? (
    <div className="landing">
      <div className="left-container">
        <h1>Starred</h1>
        <h3>
          🌟 Transform Your Child's Routine into a World of Achievements! 🌟
        </h3>
        <p>
          Our platform is designed to make daily tasks and responsibilities
          exciting and rewarding for your little ones, helping to instill a
          sense of achievement and responsibility from an early age. To get
          started, simply register for an account and create a profile. If you
          already have an account, please sign in!
        </p>
        <div className="buttons">
          <button className="login-button" onClick={setLoginView}>
            Login
          </button>
          <button className="register-button" onClick={setRegisterView}>
            Register
          </button>
        </div>
      </div>
      <div className="right-container">
        <div className="image-placeholder"></div>
      </div>
    </div>
  ) : (
    <>
      {view === views.login && <Login cb={setRegisterView} />}
      {view === views.register && <Register cb={setLoginView} />}
    </>
  );
}

export default Landing;
