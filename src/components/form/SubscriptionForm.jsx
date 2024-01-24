import { useEffect, useState, useContext } from 'react'
import { useTracsContext } from '../../hooks/useTracsContext'
import Terms from './Terms'
import ProgramInput from './ProgramInput'
import axios from 'axios'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import Form from 'react-bootstrap/Form'
import { ProgramsContext } from '../../context/ProgramsContext'

const SubscriptionForm = () => {
  const programs = useContext(ProgramsContext)
  const { dispatch } = useTracsContext()
  const [ enableButton, setEnableButton ] = useState(false)
  const [ show, setShow ] = useState(false)
  const [ termsOfUse, setTermsOfUse ] = useState(false)
  // const location = useLocation()

  const [ formData, setFormData ] = useState({
    programId: '',
    name: '',
    title: '',
    phone: '',
    email: '',
    subscriptionPeriod: '',
    startDate: ''
  })
  const {
    // eslint-disable-next-line
    programId,
    // eslint-disable-next-line
    name,
    // eslint-disable-next-line
    title,
    // eslint-disable-next-line
    phone,
    // eslint-disable-next-line
    email,
    // eslint-disable-next-line
    subscriptionPeriod,
    // eslint-disable-next-line
    startDate
  } = formData

  useEffect(() => {
    console.log(formData)
    const isValid = Object.values(formData).every((value) => value !== '')
    if(termsOfUse && isValid) {
      setEnableButton(!enableButton)
    }
    // eslint-disable-next-line
  }, [formData])

  const onMutate = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value
    }))
  } 

  const handleSelect = (programId) => {
    console.log('Selected Program ID:', programId);
    setFormData((prevFormData) => ({
      ...prevFormData,
      programId: programId.id
    })) // Sets the selected program ID
  }
  
  const handleNew = async (e) => {
    e.preventDefault()
    const trac = { ...formData }
    const infoToast = toast.info('Working on it...')
    try {
      // console.log(onProgramSelect)
      const response = await axios.post('https://qd9pusq3ze.execute-api.us-east-1.amazonaws.com/prod/create', trac)
  
      // Assuming the API response includes the necessary data in the format you expect
      const json = response.data
      dispatch({ type: 'CREATE_TRAC', payload: json })
      toast.dismiss(infoToast)
      toast.success('You have successfully submitted your carriage service request and will receive a response in 2 to 3 days.', {
        autoClose: 5000,
      })
      setTimeout(() => {
        window.location.reload(true)
      }, 5000) 
    } catch (error) {
      // Handle error here. If the response body contains JSON, it can be accessed via error.response.data
      const errorMsg = error.response && error.response.data ? error.response.data.error : error.message
      toast.dismiss(infoToast)
      toast.error(errorMsg, {
        autoClose: 5000
      })
      setTimeout(() => {
        window.location.reload(true)
      }, 5000)
    }
  }
  
  return (
    <Card>
      <Card.Header>
        <h3 className='text-center'>Subscribe to Carriage reports</h3>
      </Card.Header>
      <Card.Body>
        <Form onSubmit={handleNew}>  
          <section className='form-grid'>      
            <ProgramInput
              programs={programs}
              onProgramSelect={handleSelect}
              value={formData.programId}
            />
            <Form.Control 
              size='lg'
              type='text'
              id='name'
              placeholder={`Subscriber's Name`}
              value={formData.name}
              onChange={onMutate}
              maxLength='32'
              required  
            />         
            <Form.Control 
              size='lg'
              type='text'
              id='company'
              placeholder={`Subscriber's Company`}
              value={formData.company}
              onChange={onMutate}
              maxLength='32'
              required  
            />         
            <Form.Control 
              size='lg'
              type='text'
              id='title'
              placeholder={`Subscriber's title`}
              value={formData.title}
              onChange={onMutate}
              maxLength='32'
              required  
            />
            <Form.Control 
              size='lg'
              type='text'
              id='phone'
              placeholder={`Subscriber's phone number`}
              value={formData.phone}
              onChange={onMutate}
              maxLength='32'
              required  
            />          
            <Form.Control 
              size='lg'
              type='text'
              id='email'
              placeholder={`Subscriber's email`}
              value={formData.email}
              onChange={onMutate}
              maxLength='32'
              required 
            />
            <Form.Control 
              size='lg'
              id='subscriptionPeriod'
              list='tracPeriod'
              placeholder='Subscription Period'
              value={formData.subscriptionPeriod}
              onChange={onMutate}
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
            <Form.Control 
              size='lg'
              type='text'
              id='startDate'
              placeholder='Start Date'
              value={formData.startDate}
              onChange={onMutate}
              maxLength='32'
              required
            />
            </section>
            <div className='mt-3 mb-3 tou-grid'>
              <div className='tou-modal-link d-block m-auto' onClick={() => setShow(true)}>
                <span className="tou-modal-link">Terms of Use</span>
              </div>
              <Modal
                show={show}
                onHide={() => setShow(false)}
                id='tou'
                scrollable='true'
                >
                <Terms company={formData.company}/>
              </Modal>
              <div className="d-block m-auto">
                <Form.Check type='checkbox' data-testid='terms-check' label='Agree and accept terms' onClick={() => setTermsOfUse(true)} />
              </div>
            </div>

            <div className='d-grid'>
              <Button type='submit' data-testid='sbmt-btn' style={{color: 'white'}} disabled={!termsOfUse}>Register</Button>
              <div className='text-center mt-2'>
                <small className='fst-italic'>You must fill in all fields and agree to the Terms of Use to submit a request.</small>
              </div>
            </div>
          </Form>
        </Card.Body>
      </Card>
  )
}

export default SubscriptionForm
