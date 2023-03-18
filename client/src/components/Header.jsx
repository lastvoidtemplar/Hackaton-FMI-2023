import React from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import LoginButton from './LoginButton'
import Avatar from './Avatar'
import Leave from './Leave'

const Header = ({ leave }) => {

    const { isAuthenticated } = useAuth0();

    return (
        <header>
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                <div className="container-fluid d-flex justify-content-between">
                    {isAuthenticated && (<Leave />)}
                    {isAuthenticated ? (<Avatar />) : (<LoginButton />)}
                </div>
            </nav>
        </header>
    )
}

export default Header