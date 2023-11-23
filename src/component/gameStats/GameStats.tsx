import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import {
  Accordion,
  Badge,
  Button,
  Card,
  Col,
  Form,
  Modal,
  Row,
  Stack,
} from 'react-bootstrap'
import FirebaseCrud from '../../firebase/FirebaseCrud'
import Point from '../../entity/Point'
import Player from '../../entity/player'
import Game from '../../entity/Game'
import { Action, Pass } from '../../entity/Action'

interface ITeamDetailProps {
  selectedGame: Game
  setSelectedGame: Dispatch<SetStateAction<Game>>
}

export default function GameStats(props: ITeamDetailProps) {
  const [currentPointIndex, setCurrentPointIndex] = useState(0)
  const [isOffence, setIsOffence] = useState(true)
  const [newPass, setNewPass] = useState<Pass>(new Pass({}))
  const firebaseCrud = new FirebaseCrud()
  if (props.selectedGame.points.length === 0) {
    props.setSelectedGame(
      new Game({
        ...props.selectedGame,
        points: [new Point({})],
      })
    )
    return <></>
  }

  function generatePoints() {
    console.log(props.selectedGame)
    return props.selectedGame.points.map((point, index) => {
      return (
        <Accordion.Item
          key={index}
          eventKey={'' + index}
          onClick={() => setCurrentPointIndex(index)}
        >
          <Accordion.Header>Point #{index}</Accordion.Header>
          <Accordion.Body>
            <Form>
              <Form.Group className="mb-3" controlId="formBasicPoste">
                <Form.Label>Line</Form.Label>
                <Stack
                  className="team-list list"
                  direction="horizontal"
                  gap={3}
                >
                  {props.selectedGame?.players?.map((player, id) => {
                    if (
                      props.selectedGame?.points[index]?.players.find(
                        (playerChecked) => {
                          if (
                            playerChecked.firstName === player.firstName &&
                            playerChecked.lastName === player.lastName
                          ) {
                            return true
                          }
                        }
                      )
                    ) {
                      return <></>
                    }

                    return (
                      <Badge
                        bg="warning"
                        key={id + 'playerAway'}
                        onClick={() => addPlayerToPoint(player)}
                      >
                        {player.firstName} {player.lastName}
                      </Badge>
                    )
                  })}
                </Stack>
                <Form.Label>Joueurs</Form.Label>
                <Stack
                  className="team-list list"
                  direction="horizontal"
                  gap={3}
                >
                  {props.selectedGame.points[index].players?.map(
                    (player, id) => {
                      return (
                        <Badge
                          bg="success"
                          key={id + 'player'}
                          onClick={() => removePlayerFromPoint(id)}
                        >
                          {player.firstName} {player.lastName}
                        </Badge>
                      )
                    }
                  )}
                </Stack>
              </Form.Group>
            </Form>
            <h4>Actions</h4>
            <Form>
              <Form.Group className="mb-3" controlId="formBasicPoste">
                <Form.Label>Passeur</Form.Label>
                <Form.Select
                  aria-label="Default select example"
                  value={props.selectedGame.points[index].players.findIndex(
                    (player) => {
                      return (
                        newPass.from.firstName === player.firstName &&
                        newPass.from.lastName === player.lastName
                      )
                    }
                  )}
                >
                  {props.selectedGame.points[index].players.map(
                    (player, index) => {
                      return (
                        <option key={index} value={index}>
                          {player.firstName} {player.lastName}
                        </option>
                      )
                    }
                  )}
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicPoste">
                <Form.Label>Receveur</Form.Label>
                <Form.Select
                  aria-label="Default select example"
                  value={props.selectedGame.points[index].players.findIndex(
                    (player) => {
                      return (
                        newPass.to.firstName === player.firstName &&
                        newPass.to.lastName === player.lastName
                      )
                    }
                  )}
                >
                  {props.selectedGame.points[index].players.map(
                    (player, index) => {
                      return (
                        <option key={index} value={index}>
                          {player.firstName} {player.lastName}
                        </option>
                      )
                    }
                  )}
                </Form.Select>
              </Form.Group>
              {/* <Form.Group className="mb-3" controlId="formBasicPoste">
                <Form.Label>Receveur</Form.Label>
                <Form.Select
                  aria-label="Default select example"
                  value={newAction.player}
                >
                  {props.selectedGame.points[index].players.map(
                    (player, index) => {
                      return (
                        <option key={index} value={index}>
                          {player.firstName} {player.lastName}
                        </option>
                      )
                    }
                  )}
                </Form.Select>
              </Form.Group> */}
              <Form.Group className="mb-3" controlId="formBasicPoste">
                <Button variant="success">Nouvelle action</Button>
              </Form.Group>
            </Form>
          </Accordion.Body>
        </Accordion.Item>
      )
    })
  }

  function createPoint() {
    let tempPoints = props.selectedGame.points
    tempPoints.push(new Point({}))
    props.setSelectedGame(
      new Game({
        ...props.selectedGame,
        points: tempPoints,
      })
    )
    firebaseCrud.updateDocument(
      'Game',
      props.selectedGame.id,
      JSON.parse(
        JSON.stringify({
          ...props.selectedGame,
          points: { tempPoints },
        })
      )
    )
  }

  function addPlayerToPoint(player: Player): void {
    let points = props.selectedGame.points
    points[currentPointIndex].players.push(player)
    props.setSelectedGame(new Game({ ...props.selectedGame, points }))
  }

  function removePlayerFromPoint(index: number): void {
    let points = props.selectedGame.points
    points[currentPointIndex].players.splice(index, 1)
    props.setSelectedGame(new Game({ ...props.selectedGame, points }))
  }

  return (
    <>
      <Row>
        <Col>
          <Card>
            <Card.Header>
              <Card.Title>
                <Row>
                  <Col md={8}>
                    <h3>Game : {props.selectedGame.getName()}</h3>
                  </Col>
                  <Col className="d-flex justify-content-end">
                    <Button
                      variant="danger"
                      onClick={() => props.setSelectedGame(new Game({}))}
                    >
                      Changer de match
                    </Button>
                  </Col>
                </Row>
              </Card.Title>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={8}>
                  <h4>Points</h4>
                </Col>
                <Col className="d-flex justify-content-end">
                  <Button variant="danger" onClick={() => createPoint()}>
                    Nouveau point
                  </Button>
                </Col>
                <Col md={12}>
                  <Accordion defaultActiveKey="0">{generatePoints()}</Accordion>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  )
}
