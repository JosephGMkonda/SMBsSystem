import { useState } from 'react'
import {BrowserRouter, Navigate, Route, Routes} from 'react-router-dom'
import ProtectedRoute from './services/ProtectedRoute'
import Login from './pages/Login'
import Home from './pages/Home'
import Loan from './pages/Loan'
import Orders from './pages/Orders'
import Product from './pages/Product'
import Sales from './pages/Sales'
import Reports from './pages/Reports'



const App = () => {

  

  return (

    
    <main className=''>
      <BrowserRouter>
        <Routes>

          <Route path='/' element={ <ProtectedRoute> <Home/> </ProtectedRoute>} />
          <Route path='/product' element={ <ProtectedRoute> <Product/> </ProtectedRoute>} />
          <Route path='/sales' element={ <ProtectedRoute> <Sales/> </ProtectedRoute>} />
          <Route path='/loan' element={ <ProtectedRoute> <Loan/> </ProtectedRoute>} />
          <Route path='/orders' element={ <ProtectedRoute> <Orders/> </ProtectedRoute>} />
          <Route path='/reports' element={ <ProtectedRoute> <Reports/> </ProtectedRoute>} />

          <Route path="/signin" element={<Login/>}/>
        </Routes>
      
      </BrowserRouter>

    </main>
  )
}

export default App
