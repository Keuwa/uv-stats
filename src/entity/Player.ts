import FirebaseEntity from "./FirebaseEntity";

export default class Player implements FirebaseEntity {
  id: string;
  firstName: string;
  lastName: string;
  mainRole?: string;
  startDate?: Date;
  constructor(data: Partial<Player>){
    Object.assign(this, data)
  }
}
