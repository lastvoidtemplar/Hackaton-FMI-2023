import React, { useState, useEffect } from "react";
import { useMediaQuery } from "react-responsive";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faArrowUp,
  faArrowDown,
} from "@fortawesome/free-solid-svg-icons";
import { useAuth0 } from "@auth0/auth0-react";
import { io } from "socket.io-client";
import { Card, Button } from "react-bootstrap";
import { useSearchParams,useParams } from "react-router-dom";
import Header from "./Header";

var owner_id;
var userID;

window.addEventListener('beforeunload', (e) => {
  e.preventDefault();
  if(owner_id == userID) {
    //HTTP to destroy party
  }
  e.returnValue = '';
});

const Party = (props) => {
  const { user, isAthenticated } = useAuth0();
  const [searchParams, setSearchParams] = useSearchParams();

  const party_id = searchParams.get("party_id");
  owner_id = searchParams.get("owner_id");
  const {code} = useParams();
  userID = user.sub.split('|')[1];
  
  // const isSmall = useMediaQuery({ query: '(min-width: 576px)' })
  // const isMedium = useMediaQuery({ query: '(min-width: 768px)' })
  const isLarge = useMediaQuery({ query: "(min-width: 992px)" });

  const imageWidth = isLarge ? 100 : 50;

  var socket;

    useEffect(() => {
      if (isAthenticated) {
        socket = io(import.meta.env.VITE_NODE_URL);
        socket.emit('join', {user_id: user.sub, party_id: party_id})

        socket.on('queue', (q) => {
          console.log(q.tracks)
          console.log(q.nowPlaying)
        })

        return () => {
          socket.emit('leave');
          socket.disconnect();
        }
      }
    }, [isAthenticated])

  const addSong = (track_id) => {
    //socket.emit("addSong", song);
    // HTTP
  };

  const vote = (voted, track_id) => {
    socket.emit("vote", {user_id: user.sub, party_id, vote: voted, track_id});
  };

  return (
    <>
      <Header socket={socket}/>
      <div className="input-group d-flex justify-content-center my-4">
        <div className="form-outline">
          <input
            type="search"
            id="form1"
            className="form-control"
            placeholder="Search"
          />
        </div>
        <button type="button" className="btn btn-secondary">
          <FontAwesomeIcon icon={faSearch} />
        </button>
      </div>

      {/* cards */}
      <div className="d-flex flex-column" style={{ overflow: "auto" }}>
        {[...Array(10)].map((e, i) => (
          <div className="d-flex justify-content-center " key={i}>
            <Card className="d-flex flex-row  justify-content-between m-3 w-100 bg-secondary text-white">
              <Card.Img
                style={{ width: `${imageWidth}px`, height: `${imageWidth}px` }}
                className="my-auto w-auto"
                variant="top"
                src="https://picsum.photos/200"
              />
              <Card.Body>
                <Card.Title>Sample song</Card.Title>
                <Card.Text>By X, Y , z Album : askjdasjkd</Card.Text>
              </Card.Body>
              <Card.Text className="my-auto me-3 fs-3">Votes: X</Card.Text>
            </Card>
            <Button variant="success" className="px-3 my-5 mx-1" onClick={vote(+1, i)}>
              <FontAwesomeIcon icon={faArrowUp} />
            </Button>
            <Button variant="danger" className="px-3 my-5 mx-1" onClick={vote(-1, i)}>
              <FontAwesomeIcon icon={faArrowDown} />
            </Button>
          </div>
        ))}
      </div>

      <Card className="d-flex flex-row  justify-content-between w-100 position-fixed bottom-0 text-white bg-dark">
        <Card.Img
          style={{ width: `${imageWidth}px`, height: `${imageWidth}px` }}
          className="my-auto w-auto"
          variant="top"
          src="https://picsum.photos/200"
        />
        <Card.Body>
          <Card.Title>Now playing</Card.Title>
          <Card.Text>
            Sample song <br></br>
            By X, Y , z Album : askjdasjkd
          </Card.Text>
        </Card.Body>
      </Card>
    </>
  );
};

export default Party;
