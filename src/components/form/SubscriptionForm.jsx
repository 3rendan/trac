import { useEffect, useState, useContext, useRef } from 'react'
import axios from 'axios'
import ReactDatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import Modal from 'react-bootstrap/Modal'
import Card from 'react-bootstrap/Card'
import Form from 'react-bootstrap/Form'
import { ProgramsContext } from '../../context/ProgramsContext'
import ProgramInput from './ProgramInput'
import Terms from './Terms'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SquareForm from './SquareForm'  // Import SquareForm

const SubscriptionForm = () => {
  const { programs, loadingPrograms } = useContext(ProgramsContext)
  const [show, setShow] = useState(false)
  const [cost, setCost] = useState()
  const [ programTitle, setProgramTitle ] = useState()
  const [termsOfUse, setTermsOfUse] = useState(false)
  const [ enableButton, setEnableButton ] = useState(false)
  const toastId = useRef(null);
  const [formData, setFormData] = useState({
    programId: '',
    name: '',
    company: '',
    title: '',
    phone: '',
    email: '',
    subscriptionDuration: '',
    startDate: '',
    paymentToken: ''
  })
  const tempCosts = {
    '1 Month': 100,
    '2 Month': 200,
    '3 Month': 300,
    '4 Month': 400,
    '5 Month': 500,
    '6 Month': 600,
    '1 Year': 1000
  }

  useEffect(() => {
    const isValid = Object.values(formData).every(value => value && value !== '')
    setEnableButton(termsOfUse && isValid)
  }, [formData, termsOfUse])

    const updateToast = (message, options) => {
      if (toast.isActive(toastId.current)) {
        toast.update(toastId.current, { ...options, render: message });
      } else {
        toastId.current = toast(message, options);
      }
    }

  const onTextChange = (e) => {
    const { id, value } = e.target
    setFormData(prevState => ({
      ...prevState,
      [id]: value
    }))
    if (id === 'subscriptionDuration') {
      const selectedCost = tempCosts[value]
      setCost(selectedCost)  // Update the cost state with the mapped value
    }
  }

  const onDateChange = (date) => {
    setFormData(prevState => ({
      ...prevState,
      startDate: date
    }))
  }

  const handleSelect = (program) => {
    setFormData(prevFormData => ({
      ...prevFormData,
      programId: program.id
    }))
    setProgramTitle(program.title)
  }

  const handlePaymentSuccess = (paymentData) => {
    const { payment } = paymentData  // Assuming the API returns the payment data under a 'payment' key
    const { id: payment_id, order_id, receipt_url } = payment
    const amount = payment.amount_money.amount
  
    const dataToSubmit = {
      ...formData,
      payment_id,
      order_id,
      receipt_url,
      note: payment.note,
      amount
    }
    updateToast('Payment successful, finalizing subscription...', { type: toast.TYPE.INFO });
    toast.promise(
      submitFormData(dataToSubmit),
      {
        info: 'Processing your subscription...',
        success: 'Subscription successful!',
        error: {
          render({ data }) {
            // This function returns the React element to display in the toast
            return <div>Error: {data.message}</div>;
          }
        }
      }
    )}
  
  const submitFormData = async (data) => {
    try {
      const response = await axios.post('https://qd9pusq3ze.execute-api.us-east-1.amazonaws.com/sandbox/create', data)
      if (response.status === 200) {
        setTimeout(() => window.location.reload(), 5000)  // Refresh page after 5 seconds
      } else {
        throw new Error('Server responded with an error');
      }
    } catch (error) {
      // You might want to handle different types of errors differently
      // For example, checking for error.response can differentiate Axios errors from others
      if (error.response) {
        // Server responded with a status code that falls out of the range of 2xx
        throw new Error(error.response.data.message || 'Failed to subscribe');
      } else if (error.request) {
        // The request was made but no response was received
        throw new Error('No response received');
      } else {
        // Something happened in setting up the request that triggered an Error
        throw new Error('Error setting up the request');
      }
    }
  }
  
  if(loadingPrograms) return 'waiting...'

  return (
    <Card>
      <Card.Header>
        <h3 className='text-center'>Subscribe to Carriage reports</h3>
      </Card.Header>
      <Card.Body>
        <Form>
          <ProgramInput
            programs={programs}
            onProgramSelect={handleSelect}
            value={formData.programId}
          />
          <section className='form-grid'>
          <Form.Group>
              <Form.Label>Subscriber's name</Form.Label>
              <Form.Control 
                size='lg'
                type='text'
                id='name'
                value={formData.name}
                onChange={onTextChange}
                maxLength='32'
                required  
              />         
            </Form.Group>
            <Form.Group>
              <Form.Label>Company</Form.Label>
              <Form.Control 
                size='lg'
                type='text'
                id='company'
                value={formData.company}
                onChange={onTextChange}
                maxLength='32'
                required  
              />         
            </Form.Group>
            <Form.Group>
              <Form.Label>Position</Form.Label>
              <Form.Control 
                size='lg'
                type='text'
                id='title'
                value={formData.title}
                onChange={onTextChange}
                maxLength='32'
                required  
                />
            </Form.Group>
            <Form.Group>
              <Form.Label>Phone Number</Form.Label>
              <Form.Control 
                size='lg'
                type='text'
                id='phone'
                value={formData.phone}
                onChange={onTextChange}
                maxLength='32'
                required  
                />
            </Form.Group>
            <Form.Group>
              <Form.Label>Email</Form.Label>
              <Form.Control 
                size='lg'
                type='text'
                id='email'
                value={formData.email}
                onChange={onTextChange}
                maxLength='32'
                required 
                />
            </Form.Group> 
            <Form.Group>
              <Form.Label>Subscription duration</Form.Label>
              <Form.Control 
                size='lg'
                id='subscriptionDuration'
                list='tracPeriod'
                value={formData.subscriptionDuration}
                onChange={onTextChange}
                maxLength='32'
                required 
              />
              <datalist id='tracPeriod'>
                <option value='1 Month' />
                <option value='2 Month' />
                <option value='3 Month' />
                <option value='4 Month' />
                <option value='5 Month' />
                <option value='6 Month' />
                <option value='1 Year' />
              </datalist>           
            </Form.Group>         
            <Form.Group>
              <Form.Label>Start Date</Form.Label>
              <ReactDatePicker
                selected={formData.startDate}
                onChange={onDateChange}
                id='startDate'
                dateFormat='MMMM d, yyyy'  // You can customize the date format
                className='form-control form-control-lg'  // Apply Bootstrap form control styles
                required
              />
            </Form.Group>
          </section>
          <div className='mt-3 mb-3 tou-grid'>
            <div className='tou-modal-link d-block m-auto' onClick={() => setShow(true)}>
              Terms of Use
            </div>
            <Modal
              show={show}
              onHide={() => setShow(false)}
              id='tou'
              scrollable={true}
            >
              <Terms company={formData.company}/>
            </Modal> 
            <div className='d-block m-auto'>
              <Form.Check type='checkbox' label='Agree and accept terms' onClick={() => setTermsOfUse(!termsOfUse)} />
            </div>
          </div>                     
        </Form>
        <div style={{ display: cost ? 'block' : 'none' }}>
          <p>You will be charged: ${cost}</p>
        </div>
        <SquareForm 
          onPaymentSuccess={handlePaymentSuccess} 
          cost={cost}
          formData={formData}
          programTitle={programTitle}
        />
      </Card.Body>
      <ToastContainer 
        limit='1'
        position="middle-center"
        autoClose={5000}
        hideProgressBar={true}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        pauseOnHover
      />
    </Card>
  )
}

export default SubscriptionForm
