import * as React from 'react'
import { createBrowserRouter } from 'react-router-dom'
import RootLayout from '../RootLayout'
import ErrorPage from './ErrorPage'
import SubscriptionForm from '../components/form/SubscriptionForm'
import CarriageService from '../components/CarriageService'

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
        element: <SubscriptionForm />
      }
    ]
  }
])
export default router
