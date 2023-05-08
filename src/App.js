import React from 'react'
import { RouterProvider } from 'react-router-dom'
import router from './routes/router'
import { ToastContainer } from 'react-toastify'
import './assets/style/main.scss'

const App = () => {
  return (
    <div className='App'>
      <RouterProvider router={router} />
      <ToastContainer
        position='top-center'
        autoClose={false}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        theme="colored" />
    </div>
  )
}

export default App
