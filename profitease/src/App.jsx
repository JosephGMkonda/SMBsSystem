import { useState } from 'react'
import {BrowserRouter, Navigate, Route, Routes} from 'react-router-dom'
import Login from './pages/Login'
import Home from './pages/Home'

const App = () => {
  

  return (

    
    <main className=''>
      <BrowserRouter>
        <Routes>

          <Route path='' element={<Home/>}/>
          <Route path="/signin" element={<Login/>}/>
        </Routes>
      
      </BrowserRouter>

    </main>
  )
}

export default App
