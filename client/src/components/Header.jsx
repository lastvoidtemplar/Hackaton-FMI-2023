import React from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import LoginButton from './LoginButton'
import Avatar from './Avatar'


const Header = () => {

    const { isAuthenticated } = useAuth0();

    return (


        <header>
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                <div className="container-fluid d-flex flex-row-reverse bd-highlight">
                    {isAuthenticated ? (<Avatar />) : (<LoginButton />)}
                </div>
            </nav>
        </header>
    )
}

export default Header