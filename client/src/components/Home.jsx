import React from 'react'
import { useState, useEffect } from 'react'
import { Link, useNavigate } from "react-router-dom";
import { useAuth0 } from '@auth0/auth0-react'
import { authenticate } from '../context/actions/authorize'
import { Button, Modal, InputGroup, Form } from 'react-bootstrap'
import Header from './Header'
import { join } from '../context/actions/party'


const Home = () => {

  const navigate = useNavigate();
  
  // Modal stuff
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [code, setCode] = useState("")

  // Auth stuff
  const { user, getAccessTokenSilently, error, logout } = useAuth0();
  const userID = user.sub.split('|')[1];
  if (!user) return null;

  // useEffect(() => {
  //   const getToken = async () => {

  //     const accessToken = await getAccessTokenSilently();
  //     const res = await authenticate(accessToken);
  //     console.log(res)
  //   }
  //   getToken();
  // }, [getAccessTokenSilently])


  const onSubmit = async (e) => {
    e.preventDefault();
    
    console.log(userID);
    console.log(await getAccessTokenSilently());
    console.log(code);
    const res = await join(await getAccessTokenSilently(), userID, code);
    if(!res.error) {
      navigate(`/party/${code}/`)
    }
    else {
      setCode("")
    }
  }

  return (
    <>
      <Header />
      <main className='text-white'>
        <h1 className='text-center display-1 fw-bold mt-5'>Sample  name</h1>
        <h2 className='text-center display-5 '>by Коч Компания</h2>
        <div className="d-flex justify-content-center gap-5 mt-5 pt-5">
          <a className="btn btn-secondary btn-lg" type="button" href={`${import.meta.env.VITE_NODE_URL}createParty?owner_id=${user.sub.split('|')[1]}`}>
            Create a party!
          </a>
          {/* <Link className="btn btn-secondary btn-lg" type="button" to='/party'>Create a party!</Link> */}
          <Button className='btn-lg' variant="secondary" onClick={handleShow}>Join a party!</Button>
          <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Join a party!</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              Join through code
              <Form.Control className='mb-3 mt-1' placeholder='Code' value={code} onChange={e => setCode(e.target.value)} />
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Close
              </Button>
              <Button variant="primary" onClick={onSubmit}>
                Submit
              </Button>
            </Modal.Footer>
          </Modal>
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