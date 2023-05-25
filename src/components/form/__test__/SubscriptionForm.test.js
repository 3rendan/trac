import { render, fireEvent, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TracsContextProvider } from '../../../context/TracsContext'
import { ProgramsProvider } from '../../../context/ProgramsContext'
import SubscriptionForm from '../SubscriptionForm'
import App from '../../../App'
import { ToastContainer } from 'react-toastify'

const submitForm = async() => {
  const submitBtn = await screen.findByRole('button', {name: /register/i})
  fireEvent.click(submitBtn)
}

const acceptTerms = () => {
  const tou = screen.getByRole('checkbox')
  fireEvent.click(tou)
}

const successToast = async () => {
  const toastSuccess = await screen.findByRole('alert', {name: 'You have successfully submitted your carriage service request and will recieve a response in 2 to 3 days.'})
  expect(toastSuccess).toBeInTheDocument()
}

const errorToast = async (e) => {
  const toastError = await screen.findByRole('alert', {name: e})
  expect(toastError).toBeInTheDocument()
  
}


const blankForm = async () => {
  const form = await screen.findByRole('form')
  expect(form.value).toBe('')
  
}


test('renders form properly', () => {
  render(<TracsContextProvider><ProgramsProvider><SubscriptionForm /></ProgramsProvider></TracsContextProvider>)
  expect(screen.getByPlaceholderText(/type to search/i)).toBeInTheDocument()
  expect(screen.getByPlaceholderText(/Subscriber's Name/i)).toBeInTheDocument()
  expect(screen.getByPlaceholderText(/Subscriber's Company/i)).toBeInTheDocument()
  expect(screen.getByPlaceholderText(/Subscriber's title/i)).toBeInTheDocument()
  expect(screen.getByPlaceholderText(/Subscriber's email/i)).toBeInTheDocument()
  expect(screen.getByPlaceholderText(/Subscriber's phone number/i)).toBeInTheDocument()
  expect(screen.getByPlaceholderText(/subscription period/i)).toBeInTheDocument()
  expect(screen.getByPlaceholderText(/start date/i)).toBeInTheDocument()
})

test('terms button disabled',  () => {
  render(<TracsContextProvider><ProgramsProvider><SubscriptionForm /></ProgramsProvider></TracsContextProvider>)
  expect(screen.getByRole('button', {name: /register/i})).toBeDisabled()
})

test('if form is filled and terms accepted register button becomes enabled', async () => {
  render(<TracsContextProvider><ProgramsProvider><SubscriptionForm /></ProgramsProvider></TracsContextProvider>)
  userEvent.type(screen.getByPlaceholderText(/type to search/i), 'React Testing')
  userEvent.type(screen.getByPlaceholderText(/Subscriber's Name/i), 'React Testing')
  userEvent.type(screen.getByPlaceholderText(/Subscriber's Company/i), 'React Testing')
  userEvent.type(screen.getByPlaceholderText(/Subscriber's title/i), 'React Testing')
  userEvent.type(screen.getByPlaceholderText(/Subscriber's email/i), 'thneed@pm.me')
  userEvent.type(screen.getByPlaceholderText(/Subscriber's phone number/i), '401 555-5555')
  userEvent.type(screen.getByPlaceholderText(/subscription period/i), '1 Year')
  userEvent.type(screen.getByPlaceholderText(/start date/i), '05/23/2023')
  acceptTerms()
  expect(await screen.findByRole('button', {name: /register/i})).toBeEnabled()
})

test('successful submission results in toastify success message, cleared form, and terms of use false', () => {
  render(<TracsContextProvider><ProgramsProvider><App /><ToastContainer /><SubscriptionForm /></ProgramsProvider></TracsContextProvider>)
  userEvent.type(screen.getByPlaceholderText(/type to search/i), 'React Testing')
  userEvent.type(screen.getByPlaceholderText(/Subscriber's Name/i), 'React Testing')
  userEvent.type(screen.getByPlaceholderText(/Subscriber's Company/i), 'React Testing')
  userEvent.type(screen.getByPlaceholderText(/Subscriber's title/i), 'React Testing')
  userEvent.type(screen.getByPlaceholderText(/Subscriber's email/i), 'thneed@pm.me')
  userEvent.type(screen.getByPlaceholderText(/Subscriber's phone number/i), '401 555-5555')
  userEvent.type(screen.getByPlaceholderText(/subscription period/i), '1 Year')
  userEvent.type(screen.getByPlaceholderText(/start date/i), '05/23/2023')
  acceptTerms()
  submitForm()
  successToast()
  blankForm()
})

// Need to test that an error appears if the form does not submit successfully
// test('error alert appears if form not submitted successfully', () => {

//   errorToast()
// })