import { useState } from 'react'
import {BrowserRouter, Route, Routes} from 'react-router-dom'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Home from './pages/Home'

function App() {

  return (
    <BrowserRouter>
    <Routes>
      <Route path ='/' element={<Login />}/>
      <Route path ='/register' element={<Register />} />
      <Route path ='/dashboard' element={<Dashboard />} />
      <Route path ='/home' element={<Home />} />
    </Routes>
    </BrowserRouter>
  )
}

export default App
