import * as React from 'react'
import { createBrowserRouter } from 'react-router-dom'
import RootLayout from './RootLayout'
import ErrorPage from './routes/ErrorPage'
import SubscriptionForm from '../form/SubscriptionForm'

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        path: '/',
        element: <SubscriptionForm />,
        errorElement: <ErrorPage />,
      }
    ]
  }
])
export default router
