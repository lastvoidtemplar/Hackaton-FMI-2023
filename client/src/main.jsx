import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import MainRoutes from './Routes'
import { Auth0ProviderWithNavigate } from './auth0-provider-navigate'
import { UserProvider } from './context/UserContext'
import './main.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/*React router is higher so that Auth0 can use useNavigate*/}
    <BrowserRouter>
      <Auth0ProviderWithNavigate>
        <UserProvider>
          <MainRoutes />
        </UserProvider>
      </Auth0ProviderWithNavigate>
    </BrowserRouter>
  </React.StrictMode>
)
