import React from 'react'
import { useState, useEffect, useContext } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { UserContext } from '../context/UserContext'
import { authenticate } from '../context/actions/authorize'
import Header from './Header'

const Home = () => {
  const { user, getAccessTokenSilently, error } = useAuth0();
  const { message, getMessage } = useState("");
  const { auth } = useContext(UserContext);

  if (!user) return null;
  if (error) return (<div>Oops</div>)

  useEffect(() => {
    const getToken = async () => {

      const accessToken = await getAccessTokenSilently();
      const res = await authenticate(accessToken);
      console.log(res)
    }
    getToken();
  }, [getAccessTokenSilently])

  return (
    <>
      <Header />
      <main className=''>
        <h1 className='text-center'>Sample  name</h1>
        <h2 className='text-center'>by koch kompania</h2>
        <div class="d-grid gap-2 d-md-block">
          <button class="btn btn-primary" type="button">Button</button>
          <button class="btn btn-primary" type="button">Button</button>
        </div>
      </main>
      {/* <div>{user.sub}</div>
        <div>{user.name}</div>
        <div>{user.email}</div>
        <div>{JSON.stringify(user, null, 2)}</div> */}
    </>
  )
}

export default Home