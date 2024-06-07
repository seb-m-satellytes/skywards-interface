import {Settlement} from "@/models/Settlement.type.ts";

export interface GameSession {
  id: number
  currentDay: number
  currentTime: string
  absoluteTime: number
}

export interface GameState {
  gameState: {
    settlements: Settlement[]
    currentSettlement: Settlement | null
    session: GameSession
  },
  events: GameEvent[]
}

export interface GameSessionResource {
  current_day: number
  current_time: string
  game_session: {
    id: number
    created_at: string
    in_game_minutes: number
    start_time: string
    updated_at: string
  }
  settlements: Settlement[]
}

export interface GameEvent {
  id: number
  description: string
  loggable_type: "Settlement" | "Character"
  loggable_id: number
  in_game_time: number
}