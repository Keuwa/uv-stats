import FirebaseEntity from './FirebaseEntity'
import Player from './player'

export interface Action {}

const PASS_TYPES = [
  'Break',
  'Ouvert',
  'Fermé',
  'Recentrage',
  'Recentrage break',
  'Ouin Ouin',
  'Longue',
] as const

export type PassTypeTuple = typeof PASS_TYPES

export type PassType = PassTypeTuple[number]

export class Pass implements Action {
  from: Player
  to: Player
  type: PassType
  failureReason:
    | 'Drop'
    | 'Passe ratée'
    | 'Mauvais choix'
    | 'Defense porteur'
    | 'Defense receveur'
    | 'Stallout'

  constructor(data: Partial<Pass>) {
    Object.assign(this, data)
  }
}
