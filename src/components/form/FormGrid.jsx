import React from 'react'
import SubscriptionForm from './SubscriptionForm'
import FYI from './FYI'

const FormGrid = () => {
  return (
    <div className='desktop-grid container'>
      <SubscriptionForm />
      <FYI />      
    </div>
  )
}

export default FormGrid
