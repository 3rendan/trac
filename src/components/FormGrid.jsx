import React from 'react'
import SubscriptionForm from './form/SubscriptionForm'
import FYI from './form/FYI'

const FormGrid = () => {
  return (
    <div className='desktop-grid container'>
      <SubscriptionForm />
      <FYI />      
    </div>
  )
}

export default FormGrid
