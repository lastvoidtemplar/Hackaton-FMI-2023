import React from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import LoginButton from './LoginButton'
import LogoutButton from './Logout'
import SignupButton from './SingUpButton'

const Navbar = () => {

    const { isAuthenticated } = useAuth0();

    return (
        <div>
            Navbar
            <br />
        {isAuthenticated ? 
            (<LogoutButton />)
            :
            (
                <>
                    <SignupButton />
                        <br />
                    <LoginButton />
                </>
            )
            
        }
        </div>
    )
}

export default Navbar