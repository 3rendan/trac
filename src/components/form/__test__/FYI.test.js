import { render, screen } from '@testing-library/react'
import FYI from './FYI'

test('renders FYI text', () => {
  render( <FYI />)
  const fyiInfo = screen.getByText(/offer immediate TRAC report subscriptions/i)
  expect(fyiInfo).toBeInTheDocument()
})
test('renders FYI header', () => {
  render( <FYI />)
  const fyiHeader = screen.queryByText(/holly golightly/i)
  expect(fyiHeader).toBeNull()
})