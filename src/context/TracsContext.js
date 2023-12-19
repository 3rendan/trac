import { createContext, useReducer, useEffect } from 'react'

export const TracsContext = createContext()

export const tracReducer = (state, action) => {
  switch (action.type) {
    case 'SET_TRACS':
      return {
        tracs: action.payload
      }
    case 'SET_TRAC':
      return {
        registration: state.tracs.filter((trac) => trac._id === action.payload._id)
      }
    case 'CREATE_TRAC':
      return {
        tracs: [action.payload, state.tracs]
      }
    case 'UPDATE_TRAC':
      return {
        registration: [action.payload, state.registration]
      }
    case 'DELETE_TRAC':
      return {
        tracs: state.tracs.filter((trac) => trac._id !== action.payload._id)
      }
    default:
      return state
  }
}

export const TracsContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(tracReducer, {'tracs': null}, () => {
    const localData = localStorage.getItem('tracs')
    return localData ? JSON.parse(localData) : []
  })
  
  useEffect(() => {
    localStorage.setItem('tracs', JSON.stringify(state))
  }, [state])

  return (
    <TracsContext.Provider value={{ ...state, dispatch }}>
      { children }
    </TracsContext.Provider>
  )  
}
