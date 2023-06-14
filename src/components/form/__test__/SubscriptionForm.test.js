import React from 'react'
import { render, fireEvent, waitFor, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { TracsProvider } from '../../../hooks/useTracsContext'
import { ProgramsProvider } from '../../../context/ProgramsContext'
import SubscriptionForm from '../SubscriptionForm'
const mockPrograms = [
  { _id: '1', programtitle: 'Program 1' },
  { _id: '2', programtitle: 'Program 2' },
]
 const Wrapper = ({ children }) => (
  <TracsProvider>
    <ProgramsProvider value={{ programs: mockPrograms }}>
      {children}
    </ProgramsProvider>
  </TracsProvider>
)
 describe('SubscriptionForm', () => {
  test('renders the form with all fields and buttons', () => {
    render(<SubscriptionForm />, { wrapper: Wrapper })
    expect(screen.getByPlaceholderText('Type to search...')).toBeInTheDocument()
    expect(screen.getByPlaceholderText("Subscriber's Name")).toBeInTheDocument()
    expect(screen.getByPlaceholderText("Subscriber's Company")).toBeInTheDocument()
    expect(screen.getByPlaceholderText("Subscriber's title")).toBeInTheDocument()
    expect(screen.getByPlaceholderText("Subscriber's phone number")).toBeInTheDocument()
    expect(screen.getByPlaceholderText("Subscriber's email")).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Subscription Period')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Start Date')).toBeInTheDocument()
    expect(screen.getByText('Terms of Use')).toBeInTheDocument()
    expect(screen.getByLabelText('Agree and accept terms')).toBeInTheDocument()
    expect(screen.getByText('Register')).toBeInTheDocument()
  })
   test('displays the terms of use modal when the link is clicked', async () => {
    render(<SubscriptionForm />, { wrapper: Wrapper })
     fireEvent.click(screen.getByText('Terms of Use'))
     await waitFor(() => {
      expect(screen.getByTestId('tou')).toBeInTheDocument()
    })
  })
   test('enables the register button when all fields are filled and terms are accepted', async () => {
    render(<SubscriptionForm />, { wrapper: Wrapper })
     fireEvent.change(screen.getByPlaceholderText('Type to search...'), { target: { value: 'Program 1' } })
    fireEvent.change(screen.getByPlaceholderText("Subscriber's Name"), { target: { value: 'John Doe' } })
    fireEvent.change(screen.getByPlaceholderText("Subscriber's Company"), { target: { value: 'Company Inc.' } })
    fireEvent.change(screen.getByPlaceholderText("Subscriber's title"), { target: { value: 'Manager' } })
    fireEvent.change(screen.getByPlaceholderText("Subscriber's phone number"), { target: { value: '123-456-7890' } })
    fireEvent.change(screen.getByPlaceholderText("Subscriber's email"), { target: { value: 'john@example.com' } })
    fireEvent.change(screen.getByPlaceholderText('Subscription Period'), { target: { value: '1 Month' } })
    fireEvent.change(screen.getByPlaceholderText('Start Date'), { target: { value: '2022-01-01' } })
    fireEvent.click(screen.getByLabelText('Agree and accept terms'))
     await waitFor(() => {
      expect(screen.getByText('Register')).not.toBeDisabled()
    })
  })
})