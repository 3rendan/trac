import { useEffect, useState, useContext } from 'react'
import axios from 'axios'
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { toast } from 'react-toastify'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import Form from 'react-bootstrap/Form'
import { useTracsContext } from '../../hooks/useTracsContext'
import { ProgramsContext } from '../../context/ProgramsContext'
import ProgramInput from './ProgramInput'
import Terms from './Terms'
import SquareForm from './SquareForm'  // Import SquareForm

const SubscriptionForm = () => {
  const programs = useContext(ProgramsContext)
  const { dispatch } = useTracsContext()
  const [enableButton, setEnableButton] = useState(false)
  const [show, setShow] = useState(false)
  const [termsOfUse, setTermsOfUse] = useState(false)
  const [formData, setFormData] = useState({
    programId: '',
    name: '',
    company: '',
    title: '',
    phone: '',
    email: '',
    subscriptionPeriod: '',
    startDate: '',
    paymentToken: ''  // Add a field to store payment token
  })

  useEffect(() => {
    const isValid = Object.values(formData).every(value => value !== '')
    setEnableButton(termsOfUse && isValid)
  }, [formData, termsOfUse])

  const onTextChange = (e) => {
    const { id, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [id]: value
    }));
  };

  const onDateChange = (date) => {
    setFormData(prevState => ({
      ...prevState,
      startDate: date
    }));
  };

  const handleSelect = (programId) => {
    setFormData(prevFormData => ({
      ...prevFormData,
      programId: programId.id
    }))
  }

  const onPaymentSuccess = (token) => {
    setFormData(prevFormData => ({
      ...prevFormData,
      paymentToken: token
    }))
    toast.success('Payment successful')
  }

  const handleNew = async (e) => {
    e.preventDefault()
    if (!formData.paymentToken) {
      toast.error('Payment information is required')
      return
    }

    const trac = { ...formData }
    const infoToast = toast.info('Working on it...')
    try {
      const response = await axios.post('https://qd9pusq3ze.execute-api.us-east-1.amazonaws.com/prod/create', trac)
      const json = response.data
      dispatch({ type: 'CREATE_TRAC', payload: json })
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
      setTimeout(() => window.location.reload(true), 5000)
    }
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
                id='subscriptionPeriod'
                list='tracPeriod'
                value={formData.subscriptionPeriod}
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
              <span className='tou-modal-link'>Terms of Use</span>
            </div>
            <Modal
              show={show}
              onHide={() => setShow(false)}
              id='tou'
              scrollable='true'
              >
                <Terms company={formData.company}/>
            </Modal>              
            <div className='d-block m-auto'>
              <Form.Check type='checkbox' data-testid='terms-check' label='Agree and accept terms' onClick={() => setTermsOfUse(true)} />
            </div>
          </div>                     
          <SquareForm 
            onPaymentSuccess={onPaymentSuccess} 
          />
          <Button type='submit' disabled={!enableButton}>Register</Button>
        </Form>
      </Card.Body>
    </Card>
  )
}

export default SubscriptionForm
