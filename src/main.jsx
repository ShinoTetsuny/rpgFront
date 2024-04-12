import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App.jsx'
import Combat from './Components/Combat.jsx'
import Nav from './Components/Nav.jsx'
import BackOffice from './backoffice/BackOffice.jsx'
import Weapon from './backoffice/[id]/Weapon.jsx'
import Boss from './backoffice/[id]/Boss.jsx'
import Mob from './backoffice/[id]/Mob.jsx'
import './styles/index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Nav />
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/combat" element={<Combat />} />
        <Route path="/backoffice" element={<BackOffice />} />

        <Route path="/backoffice/:id/weapon" element={<Weapon/>} />
        <Route path="/backoffice/:id/boss" element={<Boss/>} />
        <Route path="/backoffice/:id/mob" element={<Mob/>} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
