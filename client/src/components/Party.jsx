import React, { useState, useEffect, useContext } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons'
import { useAuth0 } from '@auth0/auth0-react'
import { UserContext } from '../context/UserContext'
import { io } from 'socket.io-client'
import Header from './Header'

const Party = () => {

    const { user, isAthenticated } = useAuth0();
    const { auth, userDispatch } = useContext(UserContext);

    useEffect(() => {
        if (isAthenticated) {
            const socket = io();
            if (auth.role == "Guest") {
                socket.emit('joinRoom', user.sub)
            }
            else {
                socket.emit('createRoom', user.sub)
            }
        }
    }, [])

    const addSong = (song) => {
        socket.emit('addSong', song)
    }

    const vote = (voted) => {
        socket.emit('vote', user.sub, Boolean(voted))
    }

    const leave = () => {
        socket.emit('leave')
    }

    return (


        <>
            <Header />

            <div className="input-group d-flex justify-content-center mt-4">
                <div className="form-outline">
                    <input type="search" id="form1" className="form-control" placeholder='Search' />
                </div>
                <button type="button" className="btn btn-primary">
                    <FontAwesomeIcon icon={faSearch} />
                </button>
            </div>

            {/* cards */}
            <div className="">
                <div className='d-flex justify-content-center'>
                    <div className="card mt-5 w-75">
                        <div className="row g-0">
                            <div className="col-md-4">
                                <img src="https://picsum.photos/200" className="img-fluid rounded-start" alt="" />
                            </div>
                            <div className="col-md-8">
                                <div className="card-body">
                                    <h5 className="card-title">Card title</h5>
                                    <p className="card-text">This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
                                    <p className="card-text"><small className="text-muted">Last updated 3 mins ago</small></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='d-flex justify-content-center'>
                    <div className="card mb-3 mt-5 w-75">
                        <div className="row g-0">
                            <div className="col-md-4">
                                <img src="https://picsum.photos/200" className="img-fluid rounded-start" alt="" />
                            </div>
                            <div className="col-md-8">
                                <div className="card-body">
                                    <h5 className="card-title">Card title</h5>
                                    <p className="card-text">This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
                                    <p className="card-text"><small className="text-muted">Last updated 3 mins ago</small></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='d-flex justify-content-center'>
                    <div className="card mb-3 mt-5 w-75">
                        <div className="row g-0">
                            <div className="col-md-4">
                                <img src="https://picsum.photos/200" className="img-fluid rounded-start" alt="" />
                            </div>
                            <div className="col-md-8">
                                <div className="card-body">
                                    <h5 className="card-title">Card title</h5>
                                    <p className="card-text">This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
                                    <p className="card-text"><small className="text-muted">Last updated 3 mins ago</small></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='d-flex justify-content-center'>
                    <div className="card mb-3 mt-5 w-75">
                        <div className="row g-0">
                            <div className="col-md-4">
                                <img src="https://picsum.photos/200" className="img-fluid rounded-start" alt="" />
                            </div>
                            <div className="col-md-8">
                                <div className="card-body">
                                    <h5 className="card-title">Card title</h5>
                                    <p className="card-text">This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
                                    <p className="card-text"><small className="text-muted">Last updated 3 mins ago</small></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>

    )
}

export default Party