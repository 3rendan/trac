import React from 'react'
import { render, fireEvent, waitFor, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { TracsContextProvider } from '../../../context/TracsContext'
import SubscriptionForm from '../SubscriptionForm'

 const Wrapper = ({ children }) => (
  <TracsContextProvider>
    {children}
  </TracsContextProvider>
)
const mockedTermsOfUse = jest.fn()
const mockedSubmitButton = jest.fn()

 describe('SubscriptionForm', () => {
  beforeEach(() => {
    fetch.resetMocks();
  })
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
    expect(screen.getByTestId('terms-check')).toBeInTheDocument()
    expect(screen.getByText('Agree and accept terms')).toBeInTheDocument()
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
    render(
      <SubscriptionForm 
        termsOfUse='false' 
        setTermsOfUse={mockedTermsOfUse}
        enableButton='false'
        setEnableButton={mockedSubmitButton}
      />, { wrapper: Wrapper })
    fireEvent.change(screen.getByPlaceholderText('Type to search...'), { target: { value: 'Program 1' } })
    fireEvent.change(screen.getByPlaceholderText("Subscriber's Name"), { target: { value: 'John Doe' } })
    fireEvent.change(screen.getByPlaceholderText("Subscriber's Company"), { target: { value: 'Company Inc.' } })
    fireEvent.change(screen.getByPlaceholderText("Subscriber's title"), { target: { value: 'Manager' } })
    fireEvent.change(screen.getByPlaceholderText("Subscriber's phone number"), { target: { value: '123-456-7890' } })
    fireEvent.change(screen.getByPlaceholderText("Subscriber's email"), { target: { value: 'john@example.com' } })
    fireEvent.change(screen.getByPlaceholderText('Subscription Period'), { target: { value: '1 Month' } })
    fireEvent.change(screen.getByPlaceholderText('Start Date'), { target: { value: '2022-01-01' } })
    const termsCheck = screen.getByTestId('terms-check')
    fireEvent.click(termsCheck)
    expect(screen.getByTestId('sbmt-btn')).toBeEnabled()
  })
   test('submits the form and sends the data', async () => {
    fetch.mockResponseOnce(JSON.stringify({ success: true }));
    render(<SubscriptionForm />, { wrapper: Wrapper });
    fireEvent.change(screen.getByPlaceholderText('Type to search...'), { target: { value: 'Program 1' } });
    fireEvent.change(screen.getByPlaceholderText("Subscriber's Name"), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByPlaceholderText("Subscriber's Company"), { target: { value: 'Company Inc.' } });
    fireEvent.change(screen.getByPlaceholderText("Subscriber's title"), { target: { value: 'Manager' } });
    fireEvent.change(screen.getByPlaceholderText("Subscriber's phone number"), { target: { value: '123-456-7890' } });
    fireEvent.change(screen.getByPlaceholderText("Subscriber's email"), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Subscription Period'), { target: { value: '1 Month' } });
    fireEvent.change(screen.getByPlaceholderText('Start Date'), { target: { value: '2022-01-01' } });
    const termsCheck = screen.getByTestId('terms-check')
    fireEvent.click(termsCheck)
    fireEvent.click(screen.getByTestId('sbmt-btn'))
     await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));
     const expectedRequestBody = JSON.stringify({
      ProgramID: 'Program 1',
      RequesterName: 'John Doe',
      RequesterCompany: 'Company Inc.',
      RequesterTitle: 'Manager',
      RequesterPhone: '123-456-7890',
      RequesterEmail: 'john@example.com',
      Period: '1 Month',
      StartDate: '2022-01-01',
    });
     expect(fetch).toHaveBeenCalledWith('api/tracs', {
      method: 'POST',
      body: expectedRequestBody,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  });
});



