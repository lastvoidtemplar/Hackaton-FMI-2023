import React from 'react'
import { useAuth0 } from '@auth0/auth0-react'

const LogoutButton = () => {

    // redirects to /logout - on Auth0 servers
    const { logout } = useAuth0();

    const handleLogout = () => {
        logout({
            logoutParams: {
                returnTo: window.location.origin
            }
        })
    }

    return (
        <button onClick={handleLogout}>
            Logout
        </button>
    )
}

export default LogoutButton