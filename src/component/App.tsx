import React, { useState } from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import Header from './base/Header'
import TeamList from './teamCreation/TeamList'
import TeamDetail from './teamCreation/TeamDetail'
import GameStats from './gameStats/GameStats'
import Team from '../entity/Team'
import Game from '../entity/Game'

export default function app() {
    const [selectedTeam, setSelectedTeam] = useState<Team>(new Team({}))
    const [selectedGame, setSelectedGame] = useState<Game>(new Game({}))

    return (
    <>
        <Header></Header>
        <Container>
            <Row>
                <Col>
                    {selectedTeam.id === undefined 
                    ? <TeamList setSelectedTeam={setSelectedTeam} selectedTeam={selectedTeam}></TeamList> 
                    : 
                    selectedGame.id === undefined ? 
                        <TeamDetail 
                        selectedTeam={selectedTeam}
                        setSelectedTeam={setSelectedTeam} 
                        selectedGame={selectedGame} 
                        setSelectedGame={setSelectedGame}
                        /> 
                    : <GameStats selectedGame={selectedGame} setSelectedGame={setSelectedGame}/>
                    }
                </Col>
            </Row>
        </Container>
    </>
  )
}
