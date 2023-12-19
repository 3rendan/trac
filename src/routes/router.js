import * as React from 'react'
import { createBrowserRouter } from 'react-router-dom'
import RootLayout from '../RootLayout'
import ErrorPage from './ErrorPage'
import CarriageService from '../components/CarriageService'
import FormGrid from '../components/form/FormGrid'
// import GetTrac from '../components/form/GetTrac'

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        path: '/',
        element: <CarriageService />,
        errorElement: <ErrorPage />,
      },
      {
        path: '/form',
        element: <FormGrid />
      }
    ]
  }
])
export default router
