import React, { useState } from 'react'
import { Dropdown, Button } from 'react-bootstrap';
import { useAuth0 } from '@auth0/auth0-react'


const Avatar = () => {
  // redirects to /logout - on Auth0 servers
    const { user, logout } = useAuth0();

    const handleLogout = () => {
        logout({
            logoutParams: {
                returnTo: window.location.origin
            }
        })
    }

    return (
        <Dropdown>
            <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                {/* <button className='btn btn-secondary rounded dropdown-toggle' type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                    <img className='rounded-circle me-2' src={user.picture} alt="" width="30" height="30" />
                    {user.name}
                </button> */}
                  <img className='rounded-circle me-2' src={user.picture} alt="" width="30" height="30" />
                    {user.name}
            </Dropdown.Toggle>

            <Dropdown.Menu>
                <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>

    )
}

export default Avatar