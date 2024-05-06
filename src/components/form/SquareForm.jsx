import { useEffect } from 'react'
import { payments } from '@square/web-sdk'

const SquareForm = ({ onPaymentSuccess }) => {
  const applicationId = 'sandbox-sq0idb-1Rc6WQaS0GHD8JmvpmaVOg' // SANDBOX
  const locationId = 'XK6VJKAS5R1ZM'

  useEffect(() => {
    let form
    const initializeCard = async() => {
      const payment = await payments({
        applicationId: applicationId,
        locationId: locationId,
      });

      const card = await payment.card();
      await card.attach('#card-container');

      // Function to handle payment submission
      async function handlePayment(event) {
        event.preventDefault();
        try {
          const result = await card.tokenize();
          if (result.status === 'OK') {
            onPaymentSuccess(result.token);
          } else {
            console.error('Tokenization failed:', result.errors);
          }
        } catch (error) {
          console.error('Unexpected error occurred:', error);
        }
      }

      // Add event listener to form
      form = document.getElementById('payment-form');
      form.addEventListener('submit', handlePayment);

      // Clean up
      return () => {
        card.destroy();
        if (form) {
          form.removeEventListener('submit', handlePayment);
        }
      };
    };

    initializeCard();
  }, []);

  return (
    <form id='payment-form'>
      <div id='card-container'></div>  {/* Card fields will be injected here */}
      <button type='submit'>Pay</button>
    </form>
  )
}

export default SquareForm
