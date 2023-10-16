import './App.css'
import Login from './pages/Login'
import Home from './pages/home-page'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

function App() {

  return (
    <div>

        <Routes>
          <Route exact path="/" element={<Login />} />
          <Route path="/home" element={<Home />} />
        </Routes>

    </div>
  )
}

export default App
