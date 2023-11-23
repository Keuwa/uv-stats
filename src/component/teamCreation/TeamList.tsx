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

interface ITeamListProps {
  setSelectedTeam: Dispatch<SetStateAction<Team>>
  selectedTeam: Team
}

export default function TeamList(props: ITeamListProps) {
  const [showModal, setShowModal] = useState(false)
  const [newTeamName, setNewTeamName] = useState('')
  const [allTeams, setAllTeams] = useState<Team[]>([])
  const firebaseCrud = new FirebaseCrud()

  useEffect(() => {
    firebaseCrud.listenForChanges('Team', (teams) => {
      let tempTeams: Team[] = []
      teams.forEach((team) => {
        tempTeams.push(new Team(team))
      })
      console.log(tempTeams)
      setAllTeams(tempTeams)
    })
  }, [])

  function createTeam() {
    setShowModal(false)
    firebaseCrud.createDocument({ name: newTeamName }, 'Team')
    props.setSelectedTeam(new Team({ name: newTeamName }))
  }

  return (
    <Card>
      <Card.Header>
        <Card.Title>
          <Row>
            <Col md={8}>
              <h3>Équipes</h3>
            </Col>
            <Col className="d-flex justify-content-end">
              <Button onClick={() => setShowModal(true)}>
                Créer une équipe
              </Button>
            </Col>
          </Row>
        </Card.Title>
      </Card.Header>
      <Card.Body>
        <Row>
          <Col md={12}>
            <Stack className="team-list list" direction="horizontal" gap={3}>
              {allTeams.map((team) => {
                console.log(team.id)
                return (
                  <Button
                    key={team.id}
                    onClick={() =>
                      props.setSelectedTeam(
                        allTeams.find((a) => team.id === a.id)
                      )
                    }
                  >
                    {team.name}
                  </Button>
                )
              })}
            </Stack>
          </Col>
        </Row>
      </Card.Body>
      <Modal show={showModal}>
        <Modal.Header closeButton>
          <Modal.Title>Créer une équipe</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Nom</Form.Label>
              <Form.Control
                type="text"
                placeholder="Entrez le nom"
                value={newTeamName}
                onChange={(e) => setNewTeamName(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={createTeam}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </Card>
  )
}
