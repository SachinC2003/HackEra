import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { UserProvider } from './components/Providers/UserProvider.tsx'
import { LoaderProvider } from './components/Providers/LoaderProvider.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <UserProvider>
  <LoaderProvider>
    <App />
  </LoaderProvider>
  </UserProvider>
)
