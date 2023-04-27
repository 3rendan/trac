import { useEffect, useState, useContext } from 'react'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import { useTracsContext } from '../../hooks/useTracsContext'
import ProgramsContext from '../../context/ProgramsContext'

const SubscriptionForm = () => {
  const { dispatch } = useTracsContext()
  const { programs } = useContext(ProgramsContext)
  const [ isValid, setIsValid ] = useState(false)
  const [ enableButton, setEnableButton ] = useState(false)
  const [ termsOfUse, setTermsOfUse ] = useState(false)
  const [ formData, setFormData ] = useState({
    program: '',
    subscriberName: '',
    title: '',
    phone: '',
    email: '',
    period: '',
    startDate: ''
  })
  const {
    // eslint-disable-next-line
    program,
    // eslint-disable-next-line
    subscriberName,
    // eslint-disable-next-line
    title,
    // eslint-disable-next-line
    phone,
    // eslint-disable-next-line
    email,
    // eslint-disable-next-line
    period,
    // eslint-disable-next-line
    startDate
  } = formData

  const onMutate = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value
    }))
  } 

  useEffect(() => {
    if (formData !== null) {
      setIsValid(Object.values(formData).every((value) => value !== ''));
    }
    if(termsOfUse && isValid) {
      setEnableButton(!enableButton)
    }
    // eslint-disable-next-line
  }, [formData])

  const handleNew =  async (e) => {
    e.preventDefault()
    const trac = {...formData, termsOfUse }
    const res = await fetch('/api/tracs', {
      method: 'POST',
      body: JSON.stringify(trac), 
      headers: {
        'Content-Type': 'application/json'
      }
    })
    const json = await res.json()
    if(!res.ok){
      toast.error(json.error, {
        position: 'top-center',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored',
      });
    }
    if(res.ok) {
      dispatch({type: 'CREATE_TRAC', payload: json })
      toast.success('Your registration was submitted successfully, we will be in touch.', {
        position: 'top-center',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored',
        });
      setEnableButton(!enableButton)
      setTimeout(function() {window.location.reload()}, 6000)
    }  
  }
  
  if (programs === undefined) {
    return <>Still loading...</>
  }

  return (
    <div className='card'>
      <div className='card-header'>
        <h3 className='text-center'>Subscribe to TRAC Carriage reports</h3>
      </div>
      <div className='card-body'>
        <form onSubmit={handleNew}>  
          <section className='form-grid'>      
            <input
              className='form-control-lg'
              id='program'
              list='programList'
              placeholder='Type to search...'
              value={formData.program}
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
            <input
              className='form-control-lg'
              type='text'
              id='subscriberName'
              placeholder={`Subscriber's Name`}
              value={formData.subscriberName}
              onChange={onMutate}
              maxLength='32'
              required  
            />         
            <input
              className='form-control-lg'
              type='text'
              id='title'
              placeholder={`Subscriber's title`}
              value={formData.title}
              onChange={onMutate}
              maxLength='32'
              required  
            />
            <input
              className='form-control-lg'
              type='text'
              id='phone'
              placeholder={`Subscriber's phone number`}
              value={formData.phone}
              onChange={onMutate}
              maxLength='32'
              required  
            />          
            <input
              className='form-control-lg'
              type='text'
              id='email'
              placeholder={`Subscriber's email`}
              value={formData.email}
              onChange={onMutate}
              maxLength='32'
              required 
            />
            <input
              className='form-control-lg'
              id='period'
              list='tracPeriod'
              placeholder='Subscription Period'
              value={formData.period}
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
            <input
              className='form-control-lg'
              type='text'
              id='startDate'
              placeholder='Start Date'
              value={formData.startDate}
              onChange={onMutate}
              maxLength='32'
              required
            />
            <div className='form-check terms-check mx-auto'>
              <input className='form-check-input' type='checkbox' value={termsOfUse} id='termsOfUse' onClick={ isValid ? () => setTermsOfUse(!termsOfUse) : console.log('working') }/>
              <label className='form-check-label text-nowrap' htmlFor='termsOfUse'>
                Acknowledgement of Terms
              </label>
            </div>
            </section>
            <div className='submit-btn'>
              <button className='btn' type='submit' disabled={!termsOfUse}>
                Register
              </button>
            </div>
          </form>
        </div>
        <div className='card-footer'>
          <h3 className='text-center'>FYI</h3>
          <ul>
            <li>We regret that we cannot offer immediate TRAC report subscriptions. For security reasons we ask you to log a request for your intended subscription by offering the information we request at left.</li>
            <li>Please fill every field and click 'Submit' below. We'll review your information within 2-3 business days and either approve or reject your request.</li>
            <li>In either case you will be contacted by email so please supply a correct email address. You will receive an email detailing either the acceptance or rejection of your request.</li>
            <li>If your request is accepted, you will be supplied a payment URL. You must then visit this URL in order to provide your payment.</li>
          </ul>
        </div>
      </div>
  )
}

export default SubscriptionForm
