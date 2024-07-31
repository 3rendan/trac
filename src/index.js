import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { TracsProvider } from './context/TracsContext'
import { ProgramsProvider } from './context/ProgramsContext'
import reportWebVitals from './reportWebVitals'
import './assets/style/main.scss'


const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <TracsProvider>
    <ProgramsProvider>
      <App />
    </ProgramsProvider>
    </TracsProvider>
  </React.StrictMode>
)


reportWebVitals()
