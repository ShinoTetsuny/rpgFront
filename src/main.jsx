import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App.jsx'
import Combat from './Components/Combat.jsx'
import Nav from './Components/Nav.jsx'
import './styles/index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Nav />
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/combat" element={<Combat />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
