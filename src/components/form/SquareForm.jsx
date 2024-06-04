import React, { useEffect, useRef, useState } from 'react';
import { payments } from '@square/web-sdk';

const SquarePaymentForm = (props)  => {
  const appId = 'sandbox-sq0idb-1Rc6WQaS0GHD8JmvpmaVOg'; // SANDBOX
  const locationId = 'XK6VJKAS5R1ZM';
  const cardRef = useRef(null);
  const cardButtonRef = useRef(null);
  const [sdkReady, setSdkReady] = useState(false);

  useEffect(() => {
    function loadSquareSdk() {
      if (window.Square) {
        setSdkReady(true);
      } else {
        // Retry after a delay if Square SDK is not available
        setTimeout(loadSquareSdk, 500);
      }
    }

    loadSquareSdk();
  }, []);

  useEffect(() => {
    if (!sdkReady) {
      return;
    }

    const initializeCard = async() =>{
      let paymentsInstance;
      try {
        paymentsInstance = window.Square.payments(appId, locationId);
      } catch (error) {
        console.error('Failed to initialize payments:', error);
        return;
      }

      let card;
      try {
        card = await paymentsInstance.card();
        await card.attach('#card-container');
      } catch (error) {
        console.error('Initializing card failed:', error);
        return;
      }

      cardRef.current = card;
    }

    initializeCard();
  }, [sdkReady]);

  // Inside SquarePaymentForm component
  const handlePaymentMethodSubmission = async(event) =>{
    event.preventDefault();

    try {
      const card = cardRef.current;
      cardButtonRef.current.disabled = true; // Disables the submit button
      const token = await tokenize(card);
      const verificationToken = await verifyBuyer(token);
      const paymentResults = await createPayment(token, verificationToken);
      props.onPaymentSuccess(token); // Pass the payment token to parent component
      displayPaymentResults('SUCCESS');
      console.debug('Payment Success', paymentResults);
    } catch (error) {
      cardButtonRef.current.disabled = false;
      displayPaymentResults('FAILURE');
      console.error('Payment failure:', error.message);
    }
  }

  const tokenize = async(paymentMethod) =>{
    const tokenResult = await paymentMethod.tokenize();
    if (tokenResult.status === 'OK') {
      return tokenResult.token;
    } else {
      let errorMessage = `Tokenization failed with status: ${tokenResult.status}`;
      if (tokenResult.errors) {
        errorMessage += ` and errors: ${JSON.stringify(tokenResult.errors)}`;
      }
      throw new Error(errorMessage);
    }
  }

  const verifyBuyer = async(token) => {
    const verificationDetails = {
      amount: '1.00',
      billingContact: {
        givenName: 'John',
        familyName: 'Doe',
        email: 'john.doe@square.example',
        phone: '3214563987',
        addressLines: ['123 Main Street', 'Apartment 1'],
        city: 'London',
        state: 'LND',
        countryCode: 'GB',
      },
      currencyCode: 'GBP',
      intent: 'CHARGE',
    };
    const paymentsInstance = window.Square.payments(appId, locationId);
    const verificationResults = await paymentsInstance.verifyBuyer(token, verificationDetails);
    return verificationResults.token;
  }

  const createPayment = async(token, verificationToken) => {
    const body = JSON.stringify({
      locationId,
      sourceId: token,
      verificationToken,
      idempotencyKey: crypto.randomUUID(),
    });
  
    const response = await fetch('https://qd9pusq3ze.execute-api.us-east-1.amazonaws.com/sandbox/payments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
    });
  
    if (response.ok) {
      return response.json();
    } else {
      const errorBody = await response.text();
      throw new Error(errorBody);
    }
  }
  
  const displayPaymentResults = (status) => {
    const statusContainer = document.getElementById('payment-status-container');
    if (status === 'SUCCESS') {
      console.log('success')
    } else {
      console.log('fail')
    }
  }

  return (
    <form onSubmit={handlePaymentMethodSubmission}>
      <div id="card-container"></div>
      <button ref={cardButtonRef} className="btn-pay" type="submit">Pay</button>
    </form>
  );
}

export default SquarePaymentForm;
