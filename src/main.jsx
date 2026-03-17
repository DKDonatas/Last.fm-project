import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { QueueProvider } from './context/QueueContext.jsx'
import { FavoritesProvider } from './context/FavoritesContext.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <FavoritesProvider>
        <QueueProvider>
          <App />
        </QueueProvider>
      </FavoritesProvider>
    </ThemeProvider>
  </StrictMode>,
)
