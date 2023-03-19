import React, { useState, useEffect, useContext } from "react";
import { useMediaQuery } from "react-responsive";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faArrowUp,
  faArrowDown,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { useAuth0 } from "@auth0/auth0-react";
import { Card, Button, Dropdown } from "react-bootstrap";
import { useSearchParams, useParams } from "react-router-dom";
import Header from "./Header";
import {getQueue, search, nowPlaying, vote as vt, addQueue} from '../context/actions/party'
import { QueueContext } from "../context/queueContext";

const Party = () => {
  const { user, isAuthenticated } = useAuth0();
  const [searchParams, setSearchParams] = useSearchParams();

  const party_id = searchParams.get("party_id");
  const owner_id = searchParams.get("owner_id");
  const { code } = useParams();
  const userID = user.sub.split('|')[1];

  const isLarge = useMediaQuery({ query: "(min-width: 992px)" });

  const imageWidth = isLarge ? 100 : 50;

  const { queueState, queueStateDispatch } = useContext(QueueContext)

  const SECONDS = 10000;

  useEffect(() => {
    const interval = setInterval(async () => {
      await getQueue(party_id, queueStateDispatch);
      await nowPlaying(party_id, queueStateDispatch);
    }, SECONDS);
  
    return () => clearInterval(interval); // This represents the unmount function, in which you need to clear your interval to prevent memory leaks.
  }, [])

  const handleSearch = async (e) => {
    e.preventDefault();
    const res = await search(party_id, e.target.va, queueStateDispatch)
  }

  const vote = async (track_id, dir) => {
    const res = await vt(userID, party_id, track_id, dir, queueStateDispatch)
  }

  return (
    <>
      <Header />

      <Dropdown variant="secondary" className="d-flex justify-content-center">
        <Dropdown.Toggle id="dropdown-basic">
          <div as={Dropdown.Toggle} className="input-group d-flex justify-content-center my-4">
            <div className="form-outline">
              <input
                type="search"
                id="form1"
                className="form-control"
                placeholder="Search"
              />
            </div>
            <button type="button" className="btn btn-secondary" onClick={(e) => handleSearch(e)}>
              <FontAwesomeIcon icon={faSearch} />
            </button>
          </div>
        </Dropdown.Toggle>

        <Dropdown.Menu>
          {queueState.searchQueue.map((e, i) => (
            <Dropdown.Item>
              <div className="d-flex flex-column" style={{ overflow: "auto" }}>

                <div className="d-flex justify-content-center " key={i}>
                  <Card className="d-flex flex-row  justify-content-between m-3 w-100 bg-secondary text-white">
                    <Card.Img
                      style={{ width: `${imageWidth}px`, height: `${imageWidth}px` }}
                      className="my-auto w-auto"
                      variant="top"
                      src={`${e.track.image}`}
                    />
                    <Card.Body>
                      <Card.Title>{e.track.name}</Card.Title>
                      <Card.Text>By: {e.track.authors[0]} Album: {e.track.album}</Card.Text>
                    </Card.Body> 
                    <Card.Text className="my-auto me-3 fs-3">Votes: {e.score}</Card.Text>
                  </Card>
                  <Button variant="success" className="px-3 my-5 mx-1" onClick={() => vote(e.track.id, 1)}>
                    <FontAwesomeIcon icon={faPlus} />
                  </Button>
                </div>
              </div></Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>


      {/* cards */}
      <div className="d-flex flex-column" style={{ overflow: "auto" }}>
        {queueState.queue.map((e, i) => (
          <div className="d-flex justify-content-center " key={i}>
            <Card className="d-flex flex-row  justify-content-between m-3 w-100 bg-secondary text-white">
              <Card.Img
                style={{ width: `${imageWidth}px`, height: `${imageWidth}px` }}
                className="my-auto w-auto"
                variant="top"
                src={`${e.track.image}`}
              />
              <Card.Body>
                <Card.Title>{e.track.name}</Card.Title>
                <Card.Text>By: {e.track.author[0]} Album: {e.track.album}</Card.Text>
              </Card.Body>
              <Card.Text className="my-auto me-3 fs-3">Votes: {e.score}</Card.Text>
            </Card>
            <Button variant="success" className="px-3 my-5 mx-1" onClick={() => vote(1, i)}>
              <FontAwesomeIcon icon={faArrowUp} />
            </Button>
            <Button variant="danger" className="px-3 my-5 mx-1" onClick={() => vote(-1, i)}>
              <FontAwesomeIcon icon={faArrowDown} />
            </Button>
          </div>
        ))}
      </div>

      {queueState.nowPlaying != null && (
        <Card className="d-flex flex-row  justify-content-between w-100 position-fixed bottom-0 text-white bg-dark">
          <Card.Img
            style={{ width: `${imageWidth}px`, height: `${imageWidth}px` }}
            className="my-auto w-auto"
            variant="top"
            src={`${queueState.nowPlaying.track.image}`}
            />
          <Card.Body>
            <Card.Title>Now playing</Card.Title>
            <Card.Text>
              {queueState.nowPlaying.track.name} <br></br>
              By: {queueState.nowPlaying.track.authors[0]} 
              Album: {queueState.nowPlaying.track.album}
            </Card.Text>
          </Card.Body>
        </Card>
        )}
      </>
    );
};

export default Party;
