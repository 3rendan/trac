import { useEffect, useState, useContext } from 'react'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useTracsContext } from '../../hooks/useTracsContext'
import ProgramsContext from '../../context/ProgramsContext'
import Terms from './Terms'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import Form from 'react-bootstrap/Form'

const SubscriptionForm = () => {
  const { dispatch } = useTracsContext()
  const { programs } = useContext(ProgramsContext)
  const [ isValid, setIsValid ] = useState(false)
  const [ enableButton, setEnableButton ] = useState(false)
  const [ show, setShow ] = useState(false)
  const [ termsOfUse, setTermsOfUse ] = useState(false)

  const [ formData, setFormData ] = useState({
    ProgramID: '',
    RequestorName: '',
    RequestorCompany: '',
    RequestorTitle: '',
    RequestorPhone: '',
    RequestorEmail: '',
    Period: '',
    StartDate: ''
  })
  const {
    // eslint-disable-next-line
    ProgramID,
    // eslint-disable-next-line
    RequestorName,
    // eslint-disable-next-line
    RequestorCompany,
    // eslint-disable-next-line
    RequestorTitle,
    // eslint-disable-next-line
    RequestorPhone,
    // eslint-disable-next-line
    RequestorEmail,
    // eslint-disable-next-line
    Period,
    // eslint-disable-next-line
    StartDate
  } = formData

  useEffect(() => {
    if (formData !== null) {
      setIsValid(Object.values(formData).every((value) => value !== ''));
    }
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

  const agreeAndClose = () => {
    setShow(false)
    setTermsOfUse(true)
  }

  const handleNew =  async (e) => {
    e.preventDefault()
    let tracJSON = new URLSearchParams({...formData})
    const trac = tracJSON.toString()
    const xhr = new XMLHttpRequest();
    xhr.addEventListener('load', () => {
      setFormData({
        ProgramID: '',
        RequestorName: '',
        RequestorTitle: '',
        RequestorPhone: '',
        RequestorEmail: '',
        Period: '',
        StartDate: ''
      })
      setTermsOfUse(false)
      toast.success('You have successfully submitted your carriage service request and will recieve a response in 2 to 3 days.')
    })
    xhr.addEventListener('error', (e) => {
      toast.error(e)
    })
    xhr.open('POST', 'api/tracs', true)
    // THESE ARE SETTINGS FOR THE DOMINO SERVER
    // xhr.open('POST', 'https://beta.aptonline.org/TRACSubs.nsf/Request?CreateDocument', true)
    // xhr.setRequestHeader('Authorization', 'Basic ' + btoa(process.env.USERNAME:process.env.PASSWORD))
    // xhr.withCredentials = true
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
    xhr.send(trac) 
  }
  
  if (programs === undefined) {
    return <>Still loading...</>
  }

  return (
    <Card>
      <Card.Header>
        <h3 className='text-center'>Subscribe to TRAC Carriage reports</h3>
      </Card.Header>
      <Card.Body>
        <Form onSubmit={handleNew}>  
          <section className='form-grid'>      
            <Form.Control 
              size='lg'
              id='ProgramID'
              list='programList'
              placeholder='Type to search...'
              value={formData.ProgramID}
              onChange={onMutate}
              maxLength='32'
              required  
            />
            <datalist id='programList'>
              { programs && programs.map((program) => {
                return (
                  <option key={program._id} value={program.programtitle} />
                )
              })}
            </datalist>
            <Form.Control 
              size='lg'
              type='text'
              id='RequestorName'
              placeholder={`Subscriber's Name`}
              value={formData.RequestorName}
              onChange={onMutate}
              maxLength='32'
              required  
            />         
            <Form.Control 
              size='lg'
              type='text'
              id='RequestorCompany'
              placeholder={`Subscriber's Company`}
              value={formData.RequestorCompany}
              onChange={onMutate}
              maxLength='32'
              required  
            />         
            <Form.Control 
              size='lg'
              type='text'
              id='RequestorTitle'
              placeholder={`Subscriber's title`}
              value={formData.RequestorTitle}
              onChange={onMutate}
              maxLength='32'
              required  
            />
            <Form.Control 
              size='lg'
              type='text'
              id='RequestorPhone'
              placeholder={`Subscriber's phone number`}
              value={formData.RequestorPhone}
              onChange={onMutate}
              maxLength='32'
              required  
            />          
            <Form.Control 
              size='lg'
              type='text'
              id='RequestorEmail'
              placeholder={`Subscriber's email`}
              value={formData.RequestorEmail}
              onChange={onMutate}
              maxLength='32'
              required 
            />
            <Form.Control 
              size='lg'
              id='Period'
              list='tracPeriod'
              placeholder='Subscription Period'
              value={formData.Period}
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
              id='StartDate'
              placeholder='Start Date'
              value={formData.StartDate}
              onChange={onMutate}
              maxLength='32'
              required
            />
            </section>
            <div className='text-center mt-1 mb-1'>
              <h4 className='tou-modal-link' onClick={() => setShow(true)}>
                Terms of Use
              </h4>
            </div>
              <Modal
                show={show}
                onHide={() => setShow(false)}
                id='tou'
                scrollable='true'
              >
                <Terms company={formData.RequestorCompany}/>
                <Modal.Footer className='d-grid'>
                  <Button onClick={() => agreeAndClose()}>Agree</Button>
                </Modal.Footer>
              </Modal>
            <div className='d-grid'>
              <Button type='submit' style={{color: 'white'}} disabled={!termsOfUse}>Register</Button>
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
