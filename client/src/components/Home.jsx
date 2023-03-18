import React from 'react'
import { useState, useEffect, useContext } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { RoleContext } from '../context/RoleContext'
import Header from './Header'

const Home = () => {
  const { user, getAccessTokenSilently, error } = useAuth0();
  const { message, getMessage } = useState("");
  const { role } = useContext(RoleContext);

  if(!user) return null;
  if(error) return (<div>Oops</div>)

  useEffect(() => {
    const getToken = async () => {

      const accessToken = await getAccessTokenSilently();
      console.log(accessToken)
      console.log(role)
    }
    getToken();
  }, [getAccessTokenSilently])

  return (
    <>
        <Header />
        <body>
          
        </body>
        {/* <div>{user.sub}</div>
        <div>{user.name}</div>
        <div>{user.email}</div>
        <div>{JSON.stringify(user, null, 2)}</div> */}
    </>
  )
}

export default Home