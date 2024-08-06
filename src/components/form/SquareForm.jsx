import React, { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SquarePaymentForm = ({ cost, onPaymentSuccess, formData, programTitle }) => {
  const appId = 'sandbox-sq0idb-1Rc6WQaS0GHD8JmvpmaVOg' // SANDBOX
  const locationId = 'XK6VJKAS5R1ZM'
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
  //   console.log(token, cost)
  //   try {
  //       const response = await axios('https://qd9pusq3ze.execute-api.us-east-1.amazonaws.com/sandbox/payments', {
  //           method: 'POST',
  //           headers: {
  //               'Content-Type': 'application/json'
  //           },
  //           body: JSON.stringify({ token, cost })
  //       })

  //       const data = await response.json()
  //       if (response.ok) {
  //           return { success: true, data: data }
  //       } else {
  //           throw new Error(data.error || 'Payment failed')
  //       }
  //   } catch (error) {
  //       return { success: false, error: error.message }
  //   }
  // }

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!cardRef.current) {
      console.error('Card ref not set');
      return;
    }
    toast.info('Submitting payment information')
    try {
      const tokenResult = await cardRef.current.tokenize();
      if (tokenResult.status !== 'OK') {
        throw new Error('Failed to tokenize card');
      }
      const paymentData = {
        source_id: tokenResult.token,
        idempotency_key: crypto.randomUUID(),
        amount_money: {
          amount: cost * 100,  // Convert cost to cents as required by many payment processors
          currency: 'USD'
        },
        note: `Payment by ${formData.name} for a carriage report subscription to ${programTitle} beginning on ${formData.startDate}, lasting for ${formData.subscriptionDuration}`
      };
  
      const paymentResponse = await axios.post('https://qd9pusq3ze.execute-api.us-east-1.amazonaws.com/sandbox/payments', paymentData);
      if (paymentResponse.status === 200) {
        toast.success('Payment successful, submitting form data.')
        onPaymentSuccess(paymentResponse.data);  // Pass the entire payment response data to the callback
      } else {
        toast.error('There was a problem with your payment, please try again.')
        throw new Error('Payment failed');
      }
    } catch (error) {
      console.error('Payment error:', error);
    }
  };
  
  
  return (
    <form onSubmit={handleSubmit}>
      <div id='card-container'></div>
      <button ref={cardButtonRef} className='btn-pay' type='submit'>Pay { cost ? `$${cost}` : ''}</button>
      <ToastContainer 
        limit='1'
        position="middle-center"
        autoClose={3000}
        hideProgressBar={true}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        // pauseOnHover
      />
    </form>
  )
}
  

export default SquarePaymentForm
