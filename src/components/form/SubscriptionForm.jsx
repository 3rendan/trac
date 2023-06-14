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
  const [ enableButton, setEnableButton ] = useState(false)
  const [ show, setShow ] = useState(false)
  const [ termsOfUse, setTermsOfUse ] = useState(false)

  const [ formData, setFormData ] = useState({
    ProgramID: '',
    RequesterName: '',
    RequesterCompany: '',
    RequesterTitle: '',
    RequesterPhone: '',
    RequesterEmail: '',
    Period: '',
    StartDate: ''
  })
  const {
    // eslint-disable-next-line
    ProgramID,
    // eslint-disable-next-line
    RequesterName,
    // eslint-disable-next-line
    RequesterCompany,
    // eslint-disable-next-line
    RequesterTitle,
    // eslint-disable-next-line
    RequesterPhone,
    // eslint-disable-next-line
    RequesterEmail,
    // eslint-disable-next-line
    Period,
    // eslint-disable-next-line
    StartDate
  } = formData

  useEffect(() => {
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

  const agreeAndClose = () => {
    setShow(false)
    setTermsOfUse(true)
  }

  const handleNew =  async (e) => {
    e.preventDefault()
    const trac = {...formData }
    const res = await fetch('api/tracs', {
      method: 'POST',
      body: JSON.stringify(trac), 
      headers: {
        'Content-Type': 'application/json'
      }
    })
    const json = await res.json()
    if(!res.ok){
      toast.error(json.error)
    }
    if(res.ok) {
      dispatch({type: 'CREATE_TRAC', payload: json })
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
    } 
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
              name='ProgramID'
              type='text'
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
              id='RequesterName'
              placeholder={`Subscriber's Name`}
              value={formData.RequesterName}
              onChange={onMutate}
              maxLength='32'
              required  
            />         
            <Form.Control 
              size='lg'
              type='text'
              id='RequesterCompany'
              placeholder={`Subscriber's Company`}
              value={formData.RequesterCompany}
              onChange={onMutate}
              maxLength='32'
              required  
            />         
            <Form.Control 
              size='lg'
              type='text'
              id='RequesterTitle'
              placeholder={`Subscriber's title`}
              value={formData.RequesterTitle}
              onChange={onMutate}
              maxLength='32'
              required  
            />
            <Form.Control 
              size='lg'
              type='text'
              id='RequesterPhone'
              placeholder={`Subscriber's phone number`}
              value={formData.RequesterPhone}
              onChange={onMutate}
              maxLength='32'
              required  
            />          
            <Form.Control 
              size='lg'
              type='text'
              id='RequesterEmail'
              placeholder={`Subscriber's email`}
              value={formData.RequesterEmail}
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
                <Terms company={formData.RequesterCompany}/>
              </Modal>
              <div className="d-block m-auto">
                <Form.Check type='checkbox' label='Agree and accept terms' onClick={() => setTermsOfUse(true)} />
              </div>
            </div>

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
