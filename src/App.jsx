import "./App.css";
import Login from "./pages/Login";
import Home from "./pages/home-page";
import Register from "./pages/Register";
import Protected from "./components/protected";
import Landing from "./pages/Landing";
import { Routes, Route } from "react-router-dom";
/** playground is used for testing new components */
import Playground from "./pages/playground";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route
          path="/home"
          element={
            <Protected>
              <Home />
            </Protected>
          }
        />
        <Route
          path="/playground"
          element={
            <Protected>
              <Playground />
            </Protected>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </div>
  );
}

export default App;
