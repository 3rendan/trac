import { TracsContext } from '../context/TracsContext';
import { useContext } from 'react'

export const useTracsContext = () => {
  const context = useContext(TracsContext)

  if (!context) {
    throw Error('You are outside of the context')
  }

  return context
}