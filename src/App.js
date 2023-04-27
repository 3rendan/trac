import React from 'react'
import { RouterProvider } from 'react-router-dom'
import router from './routes/router'
import { ToastContainer } from 'react-toastify'
import './assets/style/main.scss'

const App = () => {
  return (
    <div className='App'>
      <RouterProvider router={router} />
      <ToastContainer />
    </div>
  )
}

export default App
