import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import MainRoutes from './Routes'
import { Auth0ProviderWithNavigate } from './auth0-provider-navigate'
import { RoleProvider } from './context/RoleContext'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/*React router is higher so that Auth0 can use useNavigate*/}
    <BrowserRouter>
      <Auth0ProviderWithNavigate>
        <RoleProvider>
          <MainRoutes />
        </RoleProvider>
      </Auth0ProviderWithNavigate>
    </BrowserRouter>
  </React.StrictMode>
)
