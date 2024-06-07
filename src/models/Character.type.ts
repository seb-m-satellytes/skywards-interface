import {Activity} from "@/models/Activity.type.ts";
import { GameEvent } from '@/store/gameStore.type.ts'

export interface Character {
  id: number
  name: string
  age?: number
  health_status?: number
  morale_status?: number
  specialization: string
  skill_level: number
  created_at: string
  updated_at: string
  settlement_id: number
  current_activity: Activity
  current_status_effect: StatusEffect
  can_go_on_activity: boolean
  filtered_game_events_last_minutes: GameEvent[]
}

export interface StatusEffect {
  id: number
  name: string
}