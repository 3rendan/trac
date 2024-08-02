import React, { createContext, useContext } from 'react'
import axios from 'axios'

export const TracsContext = createContext()

export const useTracsContext = () => useContext(TracsContext)

export const TracsProvider = ({ children }) => {
  const submitTrac = async (e, submission) => {
    e.preventDefault()
    try {
      const res = await axios.post('https://qd9pusq3ze.execute-api.us-east-1.amazonaws.com/sandbox/create', submission)
      return res
    } catch (error) {
      console.error('Error making the submission:', error)
      throw error  // Ensure errors are thrown so they can be caught in calling functions
    }
  }
  
  return (
    <TracsContext.Provider value={{ submitTrac }}>
      {children}
    </TracsContext.Provider>
  )
}
