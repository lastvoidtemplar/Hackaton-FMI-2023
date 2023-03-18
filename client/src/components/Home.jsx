import React from 'react'
import { useState, useEffect, useContext } from 'react'
import { Link } from "react-router-dom";
import { useAuth0 } from '@auth0/auth0-react'
import { UserContext } from '../context/UserContext'
import { authenticate } from '../context/actions/authorize'
import { Button, Modal, InputGroup, Form } from 'react-bootstrap'
import Header from './Header'

const Home = () => {
  // Modal stuff
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  
  // Auth stuff
  const { user, getAccessTokenSilently, error, logout } = useAuth0();
  const { auth } = useContext(UserContext);

  if (!user) return null;

  

  // useEffect(() => {
  //   const getToken = async () => {

  //     const accessToken = await getAccessTokenSilently();
  //     const res = await authenticate(accessToken);
  //     console.log(res)
  //   }
  //   getToken();
  // }, [getAccessTokenSilently])

//   useEffect(() => {
//     const handleTabClose = event => {
//       event.preventDefault();

//       console.log('beforeunload event triggered');

//       return (event.returnValue =
//         'Are you sure you want to exit?');
//     };

//     window.addEventListener('beforeunload', handleTabClose);

//     return () => {
//       window.removeEventListener('beforeunload', handleTabClose);
//     };
//   }, []);

  return (
    <>
      <Header />
      <main className='text-white'>
      <h1 className='text-center display-1 fw-bold'>Sample  name</h1>
        <h2 className='text-center display-5 '>by koch kompania</h2>
        <div className="d-flex justify-content-center gap-5 mt-5 pt-5">
          <Link className="btn btn-primary btn-lg" type="button" to='/party'>Create a party!</Link>
          <Button className='btn-lg' variant="primary" onClick={handleShow}>Join a party!</Button>
            <Modal show={show} onHide={handleClose}>
              <Modal.Header closeButton>
                <Modal.Title>Join a party!</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                Join through code
                <Form.Control className='mb-3 mt-1' placeholder='Code' />
                Join through name
                <Form.Control className='mb-3 mt-1' placeholder='Name' />
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                  Close
                </Button>
                <Button variant="primary" onClick={handleClose}>
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