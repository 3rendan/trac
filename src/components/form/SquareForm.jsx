import React, { useEffect, useRef, useState } from 'react'
import axios from 'axios'

const SquarePaymentForm = ({ cost, onPaymentSuccess, formData }) => {
  const appId = 'sandbox-sq0idb-1Rc6WQaS0GHD8JmvpmaVOg' // SANDBOX
  const locationId = 'XK6VJKAS5R1ZM'
  const accessToken = 'EAAAEPo98hU3Eo7nv9Lh1J9L9FrvWz79jii4gmm5ciZw3f1noIFxMuxdjpGuwjDD'
  const cardRef = useRef(null)
  const cardButtonRef = useRef(null)
  const [sdkReady, setSdkReady] = useState(false)

  useEffect(() => {
    const loadSquareSdk = () =>{
      if (window.Square) {
        setSdkReady(true)
      } else {
        // Retry after a delay if Square SDK is not available
        setTimeout(loadSquareSdk, 500)
      }
    }
    loadSquareSdk()
  }, [])

  useEffect(() => {
    if (!sdkReady) {
      return
    }

    const initializeCard = async () => {
      let paymentsInstance
      try {
        paymentsInstance = window.Square.payments(appId, locationId)
      } catch (error) {
        console.error('Failed to initialize payments:', error)
        return
      }
      let card
      try {
        card = await paymentsInstance.card()
        await card.attach('#card-container')
      } catch (error) {
        console.error('Initializing card failed:', error)
        return
      }
      cardRef.current = card
    }
    initializeCard()
  }, [sdkReady])

  const tokenize = async (paymentMethod) => {
    const tokenResult = await paymentMethod.tokenize()
    if (tokenResult.status === 'OK') {
      return tokenResult.token
    } else {
      let errorMessage = `Tokenization failed with status: ${tokenResult.status}`
      if (tokenResult.errors) {
        errorMessage += ` and errors: ${JSON.stringify(tokenResult.errors)}`
      }
      throw new Error(errorMessage)
    }
  }

  const submitPayment = async (token, amount) => {
    console.log(token, amount)
    try {
        const response = await fetch('https://qd9pusq3ze.execute-api.us-east-1.amazonaws.com/sandbox/payments', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ token, amount })
        });

        const data = await response.json();
        if (response.ok) {
            return { success: true, data: data };
        } else {
            throw new Error(data.error || 'Payment failed');
        }
    } catch (error) {
        return { success: false, error: error.message };
    }
};

  
  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      const card = cardRef.current;
      const token = await tokenize(card);
      console.log(await token)
      const paymentResults = await submitPayment(token); // Function to submit payment to Square
      if (paymentResults.success) {
        onPaymentSuccess(paymentResults.token); // Notify parent component
      } else {
        console.error('Payment failed:', paymentResults.error);
      }
    } catch (error) {
      console.error('Payment processing error:', error);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <div id="card-container"></div>
      <button ref={cardButtonRef} className="btn-pay" type="submit">Pay</button>
    </form>
  );
}
  

export default SquarePaymentForm
