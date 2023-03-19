import React from 'react'
import { useAuth0 } from '@auth0/auth0-react'

const LoginButton = () => {

    // goes to /authorize - i.e. Auth0 server
    const { loginWithRedirect } = useAuth0();

    const handleLogin = async () => {
        await loginWithRedirect({
            appState: {
                returnTo: "/home"
            }
        })
    }

    return (
        <button className="btn btn-secondary ms-2" type="submit" onClick={handleLogin}>
                Log in
        </button>
    )
}

export default LoginButton