import React from 'react'
import { withAuthenticationRequired } from '@auth0/auth0-react'
import Callback from '../Callback';
import Header from './Header';

export const AuthGuard = ({ component }) => {
    const Component = withAuthenticationRequired(component, {
        onRedirecting: () => (
            <Callback />
        )
    })
    return <Component />;
}