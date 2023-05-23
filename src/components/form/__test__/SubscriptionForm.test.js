import { render, fireEvent, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SubscriptionForm from '../SubscriptionForm'
import { TracsContextProvider } from '../../../context/TracsContext'
import { ProgramsProvider } from '../../../context/ProgramsContext'


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
  userEvent.type(screen.getByRole('button', {name: /agree/i}), true)


  expect(await screen.findByRole('button', {name: /register/i})).toBeEnabled()
})

test('renders form properly', () => {
  render(<TracsContextProvider><ProgramsProvider><SubscriptionForm /></ProgramsProvider></TracsContextProvider>)
  const programField = screen.getByPlaceholderText(/type to search/i)
  const nameField = screen.getByPlaceholderText(/Subscriber's Name/i)
  const workplaceField = screen.getByPlaceholderText(/Subscriber's Company/i)
  const jobField = screen.getByPlaceholderText(/Subscriber's title/i)
  const emailField = screen.getByPlaceholderText(/Subscriber's email/i)
  const phoneField = screen.getByPlaceholderText(/Subscriber's phone number/i)
  const periodField = screen.getByPlaceholderText(/subscription period/i)
  const startDateField = screen.getByPlaceholderText(/start date/i)
  expect(programField).toBeInTheDocument()
  expect(nameField).toBeInTheDocument()
  expect(workplaceField).toBeInTheDocument()
  expect(jobField).toBeInTheDocument()
  expect(emailField).toBeInTheDocument()
  expect(phoneField).toBeInTheDocument()
  expect(periodField).toBeInTheDocument()
  expect(startDateField).toBeInTheDocument()
})
// test('form makes post with proper params', async () => {
//   APIService.getD
//   fireEvent.change(programField, { 'target': 'value': 'sample value'})
//   fireEvent.change(nameField, { 'target': 'value': 'sample value'})
//   fireEvent.change(workplaceField, { 'target': 'value': 'sample value'})
//   fireEvent.change(jobField, { 'target': 'value': 'sample value'})
//   fireEvent.change(emailField, { 'target': 'value': 'sample value'})
//   fireEvent.change(phoneField, { 'target': 'value': '000 000-0000'})
//   fireEvent.change(periodField, { 'target': 'value': '1 Year'})
//   fireEvent.change(startDateField, { 'target': 'value': '05/23/23'})
//   fireEvent.click(submitBtn)

// })

