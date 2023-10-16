import './App.css'
import Login from './pages/Login'
import Home from './pages/home-page'
import Register from './pages/Register'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

function App() {

  return (
    <div>

        <Routes>
          <Route exact path="/" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/register" element={<Register />} />
        </Routes>

    </div>
  )
}

export default App
