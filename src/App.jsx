import './App.css'
import Login from './components/Login'
import Home from './components/home-page'
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
