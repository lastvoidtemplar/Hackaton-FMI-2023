import React from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import LoginButton from './LoginButton'
import Avatar from './Avatar'
import Leave from './Leave'
import { useLocation } from 'react-router-dom'



const Header = () => {
    
    const location = useLocation();
    
    const checkLocation = location.pathname === '/party';

    const { isAuthenticated } = useAuth0();

    return (
        <header>
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                <div className="container-fluid d-flex justify-content-between">
                    {/*FIX LEAVE*/}
                    {isAuthenticated && checkLocation ? (<Leave />) : (<div></div>)}
                    {isAuthenticated ? (<Avatar />) : (<LoginButton />)}
                </div>
            </nav>
        </header>
    )
}

export default Header