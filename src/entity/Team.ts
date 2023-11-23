import FirebaseEntity from "./FirebaseEntity";
import Player from "./player";

export default class Team implements FirebaseEntity {
  id: string;
  name: string;
  players?: Player[] = [];
  constructor(data: Partial<Team>){
    Object.assign(this, data)
  }
}
