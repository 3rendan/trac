import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { TracsContextProvider } from './context/TracsContext'
import { ProgramsProvider } from './context/ProgramsContext'
import reportWebVitals from './reportWebVitals'
import './assets/style/main.scss'


const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <TracsContextProvider>
    <ProgramsProvider>
      <App />
    </ProgramsProvider>
    </TracsContextProvider>
  </React.StrictMode>
)


reportWebVitals()
