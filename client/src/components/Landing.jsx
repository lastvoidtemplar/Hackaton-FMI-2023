import React, { useEffect } from 'react'
import Header from './Header'
import { useAuth0 } from '@auth0/auth0-react';

const Landing = () => {

    // goes to /authorize - i.e. Auth0 server
    const { loginWithRedirect, isAuthenticated, logout } = useAuth0();
    
    const handleSignup = async () => {
      await loginWithRedirect({
            appState: {
              returnTo: "/home"
            },
            authorizationParams: {
              screen_hint: "signup"
            }
        })
    }
    
    const handleLogout = () => {
      logout({
        logoutParams: {
          returnTo: window.location.origin
        }
      })
    }
    
    useEffect(() => {
      if(isAuthenticated) {
        handleLogout();
      }
    }, [isAuthenticated])

  return (
    <>
      <Header />
      <main className='pt-4 text-white'>
        <h1 className='text-center display-1 fw-bold'>Sample  name</h1>
        <h2 className='text-center display-5'>by Коч Компания</h2>
        <div className='d-flex justify-content-center mt-4 '>
          <button className='mt-4 btn btn-dark btn-lg' onClick={handleSignup}>Get Started</button>
        </div>
      </main>
      <Outlet />
    </>
  )
}

export default Landing