import { TracsContext } from '../context/TracsContext';
import { useContext } from 'react'

export const useTracsContext = () => {
  const context = useContext(TracsContext)

  return context
}