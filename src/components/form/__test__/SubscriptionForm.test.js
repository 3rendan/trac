import { render, screen } from '@testing-library/react'
import SubscriptionForm from './SubscriptionForm'

test('terms button disabled', () => {
  render( <SubscriptionForm />)
  const termsButton = screen.getByPlaceholderText(/help me/i)
  !expect(termsButton).toBeInTheDocument()
})