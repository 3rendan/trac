import { useEffect, useState, useContext } from 'react'
import axios from 'axios'
import ReactDatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { toast } from 'react-toastify'
import Modal from 'react-bootstrap/Modal'
import Card from 'react-bootstrap/Card'
import Form from 'react-bootstrap/Form'
import { ProgramsContext } from '../../context/ProgramsContext'
import { TracsContext } from '../../context/TracsContext'
import ProgramInput from './ProgramInput'
import Terms from './Terms'
import SquareForm from './SquareForm'  // Import SquareForm

const SubscriptionForm = () => {
  const programs = useContext(ProgramsContext)
  const { submitTrac } = useContext(TracsContext)
  const [show, setShow] = useState(false)
  const [cost, setCost] = useState()
  const [termsOfUse, setTermsOfUse] = useState(false)
  const [ enableButton, setEnableButton ] = useState(false)
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

  const handleSelect = (programId) => {
    setFormData(prevFormData => ({
      ...prevFormData,
      programId: programId.id
    }))
  }

  const onPaymentSuccess = async (token) => {
    const updatedFormData = {
      ...formData,
      paymentToken: token
    }
  
    setFormData(updatedFormData)
    toast.success('Payment successful')
    submitForm(updatedFormData)
  }

  const submitForm = async (data) => {
    const infoToast = toast.info('Working on it...')
    try {
      const response = await submitTrac(data)
      toast.dismiss(infoToast)
      toast.success('You have successfully submitted your carriage service request and will receive a response in 2 to 3 days.', {
        autoClose: 5000,
      })
      setTimeout(() => window.location.reload(true), 5000)
    } catch (error) {
      const errorMsg = error.response && error.response.data ? error.response.data.error : error.message
      toast.dismiss(infoToast)
      toast.error(errorMsg, {
        autoClose: 5000
      })
    }
  }

  const handleNew = (e) => {
    e.preventDefault() // This will prevent form submission until payment is successfully processed.
  }

  return (
    <Card>
      <Card.Header>
        <h3 className='text-center'>Subscribe to Carriage reports</h3>
      </Card.Header>
      <Card.Body>
        <Form onSubmit={handleNew}>
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
          onPaymentSuccess={onPaymentSuccess} 
          cost={cost}
          formData={formData}
          // enableButton={enableButton}
        />
      </Card.Body>
    </Card>
  )
}

export default SubscriptionForm
