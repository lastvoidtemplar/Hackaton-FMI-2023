import React from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { leave } from '../context/actions/party'
import { useAuth0 } from '@auth0/auth0-react';



const Leave = () => {

  const { user } = useAuth0();
  const { code } = useParams();
  const navigate = useNavigate();

  const onSubmit = async () => {
    await leave(user, code);
    navigate('/home');
  }


  return (
    <Link className='btn btn-danger' variant="danger" to='/home' onClick={onSubmit}>Leave</Link>
  )
}

export default Leave