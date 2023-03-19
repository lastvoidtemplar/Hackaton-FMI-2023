import React from 'react'
import { useAuth0 } from '@auth0/auth0-react'

const SignupButton = () => {

    // goes to /authorize - i.e. Auth0 server
    const { loginWithRedirect } = useAuth0();

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

    return (
        <button onClick={handleSignup}>
            Sign up
        </button>
    )
}

export default SignupButton