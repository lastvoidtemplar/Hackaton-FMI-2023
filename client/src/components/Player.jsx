import React from 'react'
import { Card } from 'react-bootstrap'

const Player = () => {
  return (
    <Card className="d-flex flex-row  justify-content-between m-3 w-100">
        <Card.Img style={{ width: `${imageWidth}px`, height: `${imageWidth}px` }} className="my-auto w-auto" variant="top" src="https://picsum.photos/200" />
        <Card.Body className='bg-secondary'>
            <Card.Title>Sample song</Card.Title>
            <Card.Text>
                By X, Y , z
                Album : askjdasjkd
            </Card.Text>
        </Card.Body>
        <Card.Text>Votes: X</Card.Text>
    </Card>
  )
}

export default Player