import { render, screen } from '@testing-library/react'
import FYI from '../FYI'

test('renders FYI text', () => {
  render( <FYI />)
  const fyiInfo = screen.getByText(/offer immediate TRAC report subscriptions/i)
  expect(fyiInfo).toBeInTheDocument()
})
