import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import {
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
import Team from '../../entity/Team'
import Player from '../../entity/player'
import Game from '../../entity/Game'

interface ITeamDetailProps {
  setSelectedTeam: Dispatch<SetStateAction<Team>>
  selectedTeam: Team
  setSelectedGame: Dispatch<SetStateAction<Game>>
  selectedGame: Game
}

export default function TeamDetail(props: ITeamDetailProps) {
  const [showModalPlayer, setShowModalPlayer] = useState(false)
  const [showModalGame, setShowModalGame] = useState(false)
  const [newPlayer, setNewPlayer] = useState<Player>({
    id: '',
    firstName: '',
    lastName: '',
    mainRole: '',
    startDate: new Date(),
  })
  const [newGame, setNewGame] = useState<Game>(
    new Game({
      opponent: '',
      team: { ...props.selectedTeam },
      competitionName: '',
      videoURL: '',
      players: [],
    })
  )

  const [allGames, setAllGames] = useState<Game[]>([])

  useEffect(() => {
    setNewGame(
      new Game({
        ...newGame,
        players: [...props.selectedTeam.players],
      })
    )
  }, [props.selectedTeam])

  useEffect(() => {
    firebaseCrud.listenForChanges(
      'Game',
      (games) => {
        let tempGames: Game[] = []
        games.forEach((games) => {
          tempGames.push(new Game(games))
        })
        console.log(tempGames)
        setAllGames(tempGames)
      },
      {
        field: 'team.id',
        operator: '==',
        value: props.selectedTeam.id,
      }
    )
  }, [props.selectedTeam])

  const firebaseCrud = new FirebaseCrud()

  function createPlayer() {
    let selectedTeam = props.selectedTeam
    selectedTeam.players.push(newPlayer)
    firebaseCrud.updateDocument('Team', selectedTeam.id, { ...selectedTeam })
    firebaseCrud.createDocument({ newPlayer }, 'Player')
    props.setSelectedTeam(selectedTeam)
    setNewPlayer({
      id: '',
      firstName: '',
      lastName: '',
      mainRole: '',
      startDate: new Date(),
    })
  }

  function createGame() {
    firebaseCrud.createDocument({ ...newGame }, 'Game').then(() => {
      console.log('Game Created')
    })
  }

  function addPlayerToGame(player: Player): void {
    let players = newGame.players
    players.push(player)
    setNewGame(new Game({ ...newGame, players }))
  }

  function removePlayerFromGame(index: number): void {
    let players = newGame.players
    players.splice(index, 1)
    setNewGame(new Game({ ...newGame, players }))
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
                    <h3>Équipe : {props.selectedTeam.name}</h3>
                  </Col>
                  <Col className="d-flex justify-content-end">
                    <Button
                      variant="danger"
                      onClick={() => props.setSelectedTeam(new Team({}))}
                    >
                      Changer d'équipe
                    </Button>
                  </Col>
                </Row>
              </Card.Title>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={12}>
                  <Stack direction="horizontal">
                    <h4>Joueurs: </h4>
                    <Button onClick={() => setShowModalPlayer(true)}>
                      Ajouter des joueurs
                    </Button>
                  </Stack>
                  <Stack
                    className="team-list list"
                    direction="horizontal"
                    gap={3}
                  >
                    {props.selectedTeam.players?.map((player, id) => {
                      console.log(player.id)
                      return (
                        <Badge key={id}>
                          {player.firstName} {player.lastName}
                        </Badge>
                      )
                    })}
                  </Stack>
                </Col>
              </Row>
            </Card.Body>
            <Modal show={showModalPlayer}>
              <Modal.Header closeButton>
                <Modal.Title>Créer une équipe</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form>
                  <Form.Group className="mb-3" controlId="formBasicNAme">
                    <Form.Label>Prénom</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Entrez le prénom"
                      value={newPlayer.firstName}
                      onChange={(e) =>
                        setNewPlayer({
                          ...newPlayer,
                          firstName: e.target.value,
                        })
                      }
                    />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formBasicLastName">
                    <Form.Label>Nom</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Entrez le nom"
                      value={newPlayer.lastName}
                      onChange={(e) =>
                        setNewPlayer({
                          ...newPlayer,
                          lastName: e.target.value,
                        })
                      }
                    />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formBasicPoste">
                    <Form.Label>Poste</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Entrez le poste principal"
                      value={newPlayer.mainRole}
                      onChange={(e) =>
                        setNewPlayer({
                          ...newPlayer,
                          mainRole: e.target.value,
                        })
                      }
                    />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formBasicPoste">
                    <Form.Label>Experience</Form.Label>
                    <Form.Control
                      type="date"
                      placeholder="Entrez la date d'inscription"
                      value={newPlayer.mainRole}
                      onChange={(e) =>
                        setNewPlayer({
                          ...newPlayer,
                          mainRole: e.target.value,
                        })
                      }
                    />
                  </Form.Group>
                </Form>
              </Modal.Body>
              <Modal.Footer>
                <Button
                  variant="secondary"
                  onClick={() => setShowModalPlayer(false)}
                >
                  Fermer
                </Button>
                <Button variant="primary" onClick={createPlayer}>
                  Ajouter un nouveau joueur
                </Button>
              </Modal.Footer>
            </Modal>
          </Card>
        </Col>
      </Row>

      <Row className="my-5">
        <Col>
          <Card>
            <Card.Header>
              <Card.Title>
                <Row>
                  <Col md={8}>
                    <h3>Matchs : {props.selectedTeam.name}</h3>
                  </Col>
                  <Col className="d-flex justify-content-end">
                    <Button onClick={() => setShowModalGame(true)}>
                      Créer un match
                    </Button>
                  </Col>
                </Row>
              </Card.Title>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={12}>
                  <Stack
                    className="match-list list"
                    direction="horizontal"
                    gap={3}
                  >
                    {allGames.map((game) => {
                      console.log(game.id)
                      return (
                        <Button
                          key={game.id}
                          onClick={() =>
                            props.setSelectedGame(
                              allGames.find((a) => game.id === a.id)
                            )
                          }
                        >
                          {game.getName()}
                        </Button>
                      )
                    })}
                  </Stack>
                </Col>
              </Row>
            </Card.Body>
            <Modal show={showModalGame}>
              <Modal.Header closeButton>
                <Modal.Title>Créer un match</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form>
                  <Form.Group className="mb-3" controlId="formBasicOpponent">
                    <Form.Label>Équipe adverse</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Entrez le nom de l'équipe adverse"
                      value={newGame.opponent}
                      onChange={(e) =>
                        setNewGame(
                          new Game({
                            ...newGame,
                            opponent: e.target.value,
                          })
                        )
                      }
                    />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formBasicVideoUrl">
                    <Form.Label>VideoUrl</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Entrez l'url de la video"
                      value={newGame.videoURL}
                      onChange={(e) =>
                        setNewGame(
                          new Game({
                            ...newGame,
                            videoURL: e.target.value,
                          })
                        )
                      }
                    />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formBasicPoste">
                    <Form.Label>Joueurs absent</Form.Label>
                    <Stack
                      className="team-list list"
                      direction="horizontal"
                      gap={3}
                    >
                      {props.selectedTeam.players?.map((player, id) => {
                        if (
                          newGame.players.find((playerChecked) => {
                            if (
                              playerChecked.firstName === player.firstName &&
                              playerChecked.lastName === player.lastName
                            ) {
                              return true
                            }
                          })
                        ) {
                          return <></>
                        }

                        return (
                          <Badge
                            bg="warning"
                            key={id + 'playerAway'}
                            onClick={() => addPlayerToGame(player)}
                          >
                            {player.firstName} {player.lastName}
                          </Badge>
                        )
                      })}
                    </Stack>
                    <Form.Label>Joueurs présent</Form.Label>
                    <Stack
                      className="team-list list"
                      direction="horizontal"
                      gap={3}
                    >
                      {newGame.players?.map((player, id) => {
                        return (
                          <Badge
                            bg="success"
                            key={id + 'player'}
                            onClick={() => removePlayerFromGame(id)}
                          >
                            {player.firstName} {player.lastName}
                          </Badge>
                        )
                      })}
                    </Stack>
                  </Form.Group>
                </Form>
              </Modal.Body>
              <Modal.Footer>
                <Button
                  variant="secondary"
                  onClick={() => setShowModalGame(false)}
                >
                  Close
                </Button>
                <Button variant="primary" onClick={createGame}>
                  Save Changes
                </Button>
              </Modal.Footer>
            </Modal>
          </Card>
        </Col>
      </Row>
    </>
  )
}
