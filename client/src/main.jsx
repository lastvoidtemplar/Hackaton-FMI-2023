import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import MainRoutes from './Routes'
import { Auth0ProviderWithNavigate } from './auth0-provider-navigate'
import './main.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Auth0ProviderWithNavigate>
          <MainRoutes />
      </Auth0ProviderWithNavigate>
    </BrowserRouter>
  </React.StrictMode>
)
