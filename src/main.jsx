import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './contexts/AuthContext.jsx'
import { PostContextProvider } from './contexts/PostContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <PostContextProvider>
      <App />
      </PostContextProvider>
    </AuthProvider>
  </StrictMode>,
)
