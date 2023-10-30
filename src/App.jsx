import "./App.css";
import Login from "./pages/Login";
import Home from "./pages/home-page";
import Register from "./pages/Register";
import Protected from "./components/Protected";
import Landing from "./pages/Landing";
import TaskCreate from "./pages/TaskCreate";
import { Routes, Route } from "react-router-dom";

function NotFound() {
  // https://ui.dev/react-router-handling-404-pages
  return <h1>404 Not Found</h1>;
}

function App() {
  return (
    <div>
      <Routes>
        <Route path="*" element={<NotFound />} />
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
          path="/task"
          element={
            <Protected>
              <TaskCreate />
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
