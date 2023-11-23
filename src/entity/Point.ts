import { Action } from './Action'
import FirebaseEntity from './FirebaseEntity'
import Player from './player'

export default class Point {
  players?: Player[] = []
  actions?: Action[] = []
  constructor(data: Partial<Point>) {
    Object.assign(this, data)
  }
}
