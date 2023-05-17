import React from 'react'
import Card from 'react-bootstrap/Card'

const FYI = () => {
  return (
    <Card>
      <Card.Header>
        <h3 className='text-center'>FYI</h3>
      </Card.Header>
      <Card.Body>
        <p>We regret that we cannot offer immediate TRAC report subscriptions. For security reasons we ask you to log a request for your intended subscription by offering the information we request at left.</p>
        <p>Please fill every field and click 'Submit' below. We'll review your information within 2-3 business days and either approve or reject your request.</p>
        <p>In either case you will be contacted by email so please supply a correct email address. You will receive an email detailing either the acceptance or rejection of your request.</p>
        <p>If your request is accepted, you will be supplied a payment URL. You must then visit this URL in order to provide your payment.</p>
      </Card.Body>
    </Card>
  )
}

export default FYI
