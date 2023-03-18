import React from "react";
import { Auth0Provider } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";

export const Auth0ProviderWithNavigate = ({ children }) => {
    // Auth0 needs it
    const nav = useNavigate();
    const domain = import.meta.env.VITE_AUTH0_DOMAIN;
    const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID;
    const redirectUri = import.meta.env.VITE_AUTH0_CALLBACK_URL;
    const audience = import.meta.env.VITE_AUDIENCE_NODE;

    // From Auth0 Login page back to current page
    const onRedirectCallback = (appState) => {
        // appstate.returnTo - the page for successful authentication
        // if not successful - to current location
        nav(appState?.returnTo || window.location.pathname);
    }

    //if(!(domain && clientId && redirectUri)) return null;

    return (
        <Auth0Provider
            domain={domain}
            clientId={clientId}
            authorizationParams={{
                audience: audience,
                redirect_uri: redirectUri
            }}
            onRedirectCallback={onRedirectCallback}
        >
            {children}
        </Auth0Provider>
    );
}