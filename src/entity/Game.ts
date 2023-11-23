import FirebaseEntity from "./FirebaseEntity";
import Point from "./Point";
import Team from "./Team";
import Player from "./player";

export default class Game implements FirebaseEntity {
  id: string;
  opponent: string;
  team: Team;
  videoURL: string;
  players: Player[] = []
  points: Point[] = [new Point({})]
  competitionName?: string
  date?: Date

  getName():string{
    return `${this.team?.name} - ${this.opponent}` 
  }

  constructor(data: Partial<Game>){
    Object.assign(this, data)
  }
}
